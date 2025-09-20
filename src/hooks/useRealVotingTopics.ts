import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";

interface Route {
  id: string;
  name: string;
  start_location: string;
  end_location: string;
}

interface Schedule {
  id: string;
  departure_time: string;
  route_id: string;
  days_of_week: string[];
}

interface Bus {
  id: string;
  bus_number: string;
  name: string;
  capacity: number;
  route: string;
  status: string;
}

interface VotingTopic {
  id: string;
  title: string;
  description: string;
  routeId: string;
  scheduleId: string;
  votes: number;
  requiredVotes: number;
  hasVoted: boolean;
  status: "active" | "completed" | "upcoming" | "approved" | "rejected";
  createdAt: Date;
  endDate: Date;
  region: string;
  busId: string;
  busNumber?: string;
  voteWeight?: number;
  rejectionReason?: string;
}

interface Coordinator {
  telegram_id: string;
}

interface NewBusRequestData {
  routeId: string;
  scheduleId: string;
  description: string;
  date: Date;
  busId: string;
  reason: string;
  endDate: Date;
}

const TELEGRAM_BOT_TOKEN = "7742027749:AAENTZ012O5SiGto0M0QMJhm-xSbtiFZETY";
const DRIVER_CHAT_ID = "1146747265"; // Your Telegram ID
const VOTE_THRESHOLD = 1;
const NOTIFICATION_SENT_KEY = "notification_sent_";
const NOTIFICATION_EXPIRY = 60 * 60 * 1000; // 1 hour in milliseconds
const VOTE_EXPIRY_HOURS = 1; // Votes expire after 1 hour

// Cache for voting topics
const votingTopicsCache = new Map<
  string,
  {
    active: VotingTopic[];
    past: VotingTopic[];
    timestamp: number;
  }
>();

const CACHE_DURATION = 5000; // 5 seconds cache
let lastFetchTime = 0;

export function useRealVotingTopics() {
  const { user } = useAuth();
  const [votingTopics, setVotingTopics] = useState<VotingTopic[]>([]);
  const [pastVotingTopics, setPastVotingTopics] = useState<VotingTopic[]>([]);
  const [availableBuses, setAvailableBuses] = useState<Bus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (force = false) => {
      if (!user) return;

      // Check if we should use cached data
      const now = Date.now();
      if (!force && now - lastFetchTime < CACHE_DURATION) {
        return;
      }

      try {
        setIsLoading(true);

        // Check cache first
        const cachedData = votingTopicsCache.get(user.id);
        if (cachedData && !force) {
          setVotingTopics(cachedData.active);
          setPastVotingTopics(cachedData.past);
          setIsLoading(false);
          return;
        }

        // Fetch active voting topics
        const { data: activeTopics, error: activeError } = await supabase
          .from("voting_topics")
          .select(
            `
          id,
          title,
          description,
          start_date,
          end_date,
          status,
          created_by,
          bus_id,
          route_id,
          schedule_id,
          profiles!created_by(region)
        `
          )
          .in("status", ["active", "processing"])
          .order("created_at", { ascending: false });

        if (activeError) throw activeError;

        // Check for expired topics and update their status
        const now = new Date();
        const expiredTopics =
          activeTopics?.filter((topic) => {
            const endDate = new Date(topic.end_date);
            return now > endDate;
          }) || [];

        if (expiredTopics.length > 0) {
          // Update expired topics to 'rejected' status
          const { error: updateError } = await supabase
            .from("voting_topics")
            .update({
              status: "rejected",
              rejection_reason: "Voting period expired",
            })
            .in(
              "id",
              expiredTopics.map((t) => t.id)
            );

          if (updateError) {
            console.error("Error updating expired topics:", updateError);
          }

          // Notify about expired topics
          for (const topic of expiredTopics) {
            await notifyDriverViaTelegram(
              {
                id: topic.id,
                title: topic.title,
                description: topic.description,
                region: topic.profiles?.region || "Unknown",
                votes: 0,
                requiredVotes: VOTE_THRESHOLD,
                hasVoted: false,
                status: "rejected",
                createdAt: new Date(topic.start_date),
                endDate: new Date(topic.end_date),
                busId: topic.bus_id || "",
                busNumber: "",
                voteWeight: 1.0,
                routeId: topic.route_id || "",
                scheduleId: topic.schedule_id || "",
              },
              "rejected"
            );
          }
        }

        // Filter out expired topics from active topics
        const validActiveTopics =
          activeTopics?.filter((topic) => {
            const endDate = new Date(topic.end_date);
            return now <= endDate;
          }) || [];

        // Fetch votes for active topics
        const { data: votesData, error: votesError } = await supabase
          .from("votes")
          .select(
            `
          id,
          topic_id,
          student_id,
          created_at,
          profiles!student_id(region)
        `
          )
          .in("topic_id", validActiveTopics?.map((t) => t.id) || []);

        if (votesError) throw votesError;

        // Fetch available buses
        const { data: busesData, error: busesError } = await supabase
          .from("buses")
          .select("id, bus_number, name, capacity, route, status")
          .eq("status", "active");

        if (busesError) throw busesError;

        // Transform bus data
        const transformedBuses: Bus[] =
          busesData?.map((bus) => ({
            id: bus.id,
            bus_number: bus.bus_number,
            name: bus.name,
            route: bus.route,
            capacity: bus.capacity,
            status: bus.status === "active" ? "on-time" : "delayed",
            departureTime: "4:30 PM",
          })) || [];

        // Process votes and remove expired votes
        const voteCountMap = new Map<
          string,
          { sameRegion: number; otherRegion: number }
        >();
        const votedTopicIds = new Set<string>();
        const validVotes =
          votesData?.filter((vote) => {
            const voteTime = new Date(vote.created_at);
            const hoursSinceVote =
              (now.getTime() - voteTime.getTime()) / (1000 * 60 * 60);
            return hoursSinceVote <= VOTE_EXPIRY_HOURS;
          }) || [];

        // Delete expired votes
        const expiredVotes =
          votesData?.filter((vote) => {
            const voteTime = new Date(vote.created_at);
            const hoursSinceVote =
              (now.getTime() - voteTime.getTime()) / (1000 * 60 * 60);
            return hoursSinceVote > VOTE_EXPIRY_HOURS;
          }) || [];

        if (expiredVotes.length > 0) {
          const { error: deleteError } = await supabase
            .from("votes")
            .delete()
            .in(
              "id",
              expiredVotes.map((v) => v.id)
            );

          if (deleteError) {
            console.error("Error deleting expired votes:", deleteError);
          }
        }

        // Process valid votes
        validVotes.forEach((vote) => {
          const topicId = vote.topic_id;
          const voterRegion = vote.profiles?.region || "Unknown";
          const current = voteCountMap.get(topicId) || {
            sameRegion: 0,
            otherRegion: 0,
          };

          if (vote.student_id === user?.id) {
            votedTopicIds.add(topicId);
          }

          if (voterRegion === user?.region) {
            current.sameRegion++;
          } else {
            current.otherRegion++;
          }

          voteCountMap.set(topicId, current);
        });

        // Transform active topics with updated vote counts
        const transformedActiveTopics =
          validActiveTopics?.map((topic) => {
            const hasVoted = votedTopicIds.has(topic.id);
            const voteCount = voteCountMap.get(topic.id) || {
              sameRegion: 0,
              otherRegion: 0,
            };
            const totalVotes =
              voteCount.sameRegion + voteCount.otherRegion * 0.5;
            const busNumber = transformedBuses.find(
              (bus) => bus.id === topic.bus_id
            )?.bus_number;
            const region = topic.profiles?.region || "Dharwad Region";

            return {
              id: topic.id,
              title: topic.title,
              description: topic.description,
              routeId: topic.route_id || "",
              scheduleId: topic.schedule_id || "",
              votes: totalVotes,
              requiredVotes: VOTE_THRESHOLD,
              hasVoted,
              status: topic.status as VotingTopic["status"],
              createdAt: new Date(topic.start_date),
              endDate: new Date(topic.end_date),
              region,
              busId: topic.bus_id,
              busNumber,
              voteWeight: 1.0,
            };
          }) || [];

        // Fetch past voting topics
        const { data: pastTopics, error: pastError } = await supabase
          .from("voting_topics")
          .select(
            `
          id,
          title,
          description,
          start_date,
          end_date,
          status,
          created_by,
          bus_id,
          route_id,
          schedule_id,
          profiles!created_by(region)
        `
          )
          .in("status", ["completed", "rejected"])
          .order("created_at", { ascending: false });

        if (pastError) throw pastError;

        // Transform past topics
        const transformedPastTopics =
          pastTopics?.map((topic) => {
            const hasVoted = votedTopicIds.has(topic.id);
            const voteCount = voteCountMap.get(topic.id) || {
              sameRegion: 0,
              otherRegion: 0,
            };
            const totalVotes =
              voteCount.sameRegion + voteCount.otherRegion * 0.5;
            const busNumber = transformedBuses.find(
              (bus) => bus.id === topic.bus_id
            )?.bus_number;
            const region = topic.profiles?.region || "Dharwad Region";

            return {
              id: topic.id,
              title: topic.title,
              description: topic.description,
              routeId: topic.route_id || "",
              scheduleId: topic.schedule_id || "",
              votes: totalVotes,
              requiredVotes: VOTE_THRESHOLD,
              hasVoted,
              status: topic.status as VotingTopic["status"],
              createdAt: new Date(topic.start_date),
              endDate: new Date(topic.end_date),
              region,
              busId: topic.bus_id,
              busNumber,
              voteWeight: 1.0,
              rejectionReason:
                topic.status === "rejected"
                  ? "Insufficient driver availability"
                  : undefined,
            };
          }) || [];

        // Update cache
        votingTopicsCache.set(user.id, {
          active: transformedActiveTopics,
          past: transformedPastTopics,
          timestamp: now.getTime(),
        });
        lastFetchTime = now.getTime();

        setVotingTopics(transformedActiveTopics);
        setPastVotingTopics(transformedPastTopics);
        setAvailableBuses(transformedBuses);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  // Set up polling to check for expired votes every minute
  useEffect(() => {
    if (!user) return;

    fetchData(true);

    const intervalId = setInterval(() => {
      fetchData(false);
    }, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [user, fetchData]);

  const notifyDriverViaTelegram = async (
    topic: VotingTopic,
    event: "threshold" | "rejected" | "approved",
    telegramId: string = "YOUR_TELEGRAM_CHAT_ID" // Default chat ID
  ) => {
    try {
      let message = "";
      switch (event) {
        case "threshold":
          message = `🚨 URGENT: LEAVE THE BUS!\n\nA new bus request has reached the voting threshold.\n\nDetails:\nTitle: ${topic.title}\nDescription: ${topic.description}\nRegion: ${topic.region}\n\nPlease check your coordinator dashboard for more information.`;
          break;
        case "rejected":
          message = `❌ REQUEST REJECTED\n\nTitle: ${topic.title}\nDescription: ${topic.description}\nFinal Votes: ${topic.votes}\nRegion: ${topic.region}\n\nRequest has been rejected.`;
          break;
        case "approved":
          message = `✅ REQUEST APPROVED\n\nTitle: ${
            topic.title
          }\nDescription: ${topic.description}\nFinal Votes: ${
            topic.votes
          }\nRegion: ${topic.region}\nBus: ${
            topic.busNumber || "Not assigned"
          }\n\nRequest has been approved and bus allocated.`;
          break;
      }

      const response = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: telegramId,
            text: message,
            parse_mode: "HTML",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Telegram API error: ${data.description}`);
      }

      return true;
    } catch (error) {
      return false;
    }
  };

  const castVote = useCallback(
    async (topicId: string, optionId: string): Promise<boolean> => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          toast.error("You must be logged in to vote");
          return false;
        }

        const { data: topic, error: topicError } = await supabase
          .from("voting_topics")
          .select("*")
          .eq("id", topicId)
          .single();

        if (topicError) throw topicError;
        if (!topic) {
          toast.error("Voting topic not found");
          return false;
        }

        // Check if voting period has ended
        if (new Date() > new Date(topic.end_date)) {
          toast.error("Voting period has ended");
          return false;
        }

        // First get the voting option ID
        const { data: options, error: optionsError } = await supabase
          .from("voting_options")
          .select("id")
          .eq("topic_id", topicId)
          .single();

        if (optionsError) {
          console.error("Error fetching voting option:", optionsError);
          toast.error("Failed to cast vote: No voting option found");
          return false;
        }

        const { error: voteError } = await supabase.from("votes").insert({
          topic_id: topicId,
          option_id: options.id,
          student_id: user.id,
        });

        if (voteError) {
          if (voteError.code === "23505") {
            // Unique violation
            toast.error("You have already voted on this topic");
          } else {
            throw voteError;
          }
          return false;
        }

        // Refresh the data
        await fetchData();

        // Fetch the latest votes for this topic directly from Supabase
        const { data: topicVotes, error: votesError } = await supabase
          .from("votes")
          .select("*")
          .eq("topic_id", topicId);

        if (votesError) {
          console.error("Error fetching votes:", votesError);
        } else if (topicVotes && topicVotes.length >= VOTE_THRESHOLD) {
          // Fetch the topic details
          const { data: topicData, error: topicError } = await supabase
            .from("voting_topics")
            .select(
              `
            *,
            profiles:profiles!created_by(region)
          `
            )
            .eq("id", topicId)
            .single();

          if (topicError) {
            console.error("Error fetching topic:", topicError);
          } else {
            // Transform topicData to VotingTopic
            const transformedTopic = {
              id: topicData.id,
              title: topicData.title,
              description: topicData.description,
              routeId: topicData.route_id || "",
              scheduleId: topicData.schedule_id || "",
              votes: topicVotes.length,
              requiredVotes: VOTE_THRESHOLD,
              hasVoted: true, // The user just voted
              status: topicData.status as VotingTopic["status"],
              createdAt: new Date(topicData.start_date),
              endDate: new Date(topicData.end_date),
              region: topicData.profiles?.region || "Dharwad Region",
              busId: topicData.bus_id,
              busNumber: "", // Not available here
              voteWeight: 1.0,
            };
            await notifyDriverViaTelegram(transformedTopic, "threshold");
            toast.success(
              "Voting threshold reached! Driver has been notified."
            );
          }
        }

        toast.success("Vote cast successfully!");
        return true;
      } catch (error) {
        console.error("Error casting vote:", error);
        toast.error("Failed to cast vote");
        return false;
      }
    },
    [fetchData]
  );

  // Request new bus function
  const requestNewBus = useCallback(
    async (data: NewBusRequestData) => {
      if (!user) {
        setError("You must be logged in to request a bus");
        return false;
      }

      try {
        setIsSubmitting(true);

        if (!data.busId) {
          setError("Please select a bus for your request");
          return false;
        }

        const { data: selectedBus, error: busError } = await supabase
          .from("buses")
          .select("*")
          .eq("id", data.busId)
          .single();

        if (busError) {
          throw new Error(`Bus query failed: ${busError.message}`);
        }

        if (!selectedBus) {
          throw new Error("Selected bus not found");
        }

        // Create new topic
        const topicData = {
          title: `Additional Bus Request - ${selectedBus.bus_number}`,
          description: data.description || data.reason,
          start_date: data.date.toISOString(),
          end_date: data.endDate.toISOString(),
          status: "active",
          created_by: user.id,
          bus_id: data.busId,
          route_id: data.routeId,
          schedule_id: data.scheduleId,
        };

        const { data: newTopic, error: topicError } = await supabase
          .from("voting_topics")
          .insert(topicData)
          .select("id")
          .single();

        if (topicError) {
          throw new Error(`Topic creation failed: ${topicError.message}`);
        }

        // Create voting option
        const optionData = {
          topic_id: newTopic.id,
          option_text: "Approve",
        };

        const { error: optionError } = await supabase
          .from("voting_options")
          .insert(optionData);

        if (optionError) {
          throw new Error(`Option creation failed: ${optionError.message}`);
        }

        // Refresh data
        await fetchData();

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to request bus");
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [votingTopics, fetchData]
  );

  // Add notifications for rejection and approval
  const rejectVotingRequest = async (voteId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("voting_topics")
        .update({
          status: "rejected",
          rejection_reason: "Request rejected by coordinator",
        })
        .eq("id", voteId);

      if (error) throw error;

      // Get the topic details for notification
      const topic = votingTopics.find((t) => t.id === voteId);
      if (topic) {
        await notifyDriverViaTelegram(topic, "rejected");
      }

      toast.success("Voting request rejected successfully!");
      fetchData();
      return true;
    } catch (error) {
      console.error("Error rejecting voting request:", error);
      toast.error("Failed to reject voting request");
      return false;
    }
  };

  const approveVotingRequest = async (
    voteId: string,
    busId: string
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("voting_topics")
        .update({
          status: "approved",
          bus_id: busId,
        })
        .eq("id", voteId);

      if (error) throw error;

      // Get the topic details for notification
      const topic = votingTopics.find((t) => t.id === voteId);
      if (topic) {
        await notifyDriverViaTelegram(topic, "approved");
      }

      toast.success("Voting request approved successfully!");
      fetchData();
      return true;
    } catch (error) {
      console.error("Error approving voting request:", error);
      toast.error("Failed to approve voting request");
      return false;
    }
  };

  return {
    votingTopics,
    pastVotingTopics,
    availableBuses,
    castVote,
    requestNewBus,
    isLoading,
    isSubmitting,
    error,
    refreshData: () => fetchData(true),
  };
}
