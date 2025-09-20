# Campus Bus Assistant - Database Schema Documentation

## Overview

This document provides a comprehensive overview of the Campus Bus Assistant database schema. The system is designed to manage campus bus operations including user management, route scheduling, real-time tracking, complaints, voting, and communication features.

## Tables Overview

### Core Tables

#### 1. `profiles`
**Purpose**: Stores user information for all system users
- **Primary Key**: `id` (TEXT)
- **Key Fields**:
  - `name`: User's full name
  - `email`: User's email address
  - `role`: User role (`student`, `driver`, `coordinator`, `admin`)
  - `region`: Campus region
  - `usn`: University Serial Number (for students)
  - `telegram_id`: Telegram integration
  - `phone_number`: Contact number

#### 2. `routes`
**Purpose**: Defines bus routes between locations
- **Primary Key**: `id` (TEXT)
- **Key Fields**:
  - `name`: Route name/identifier
  - `start_location`: Starting point
  - `end_location`: Destination
  - `region`: Campus region served
  - `distance`: Route distance in km
  - `estimated_duration`: Travel time in minutes

#### 3. `route_stops`
**Purpose**: Individual stops along each route
- **Primary Key**: `id` (TEXT)
- **Relationships**: 
  - `route_id` → `routes.id`
- **Key Fields**:
  - `stop_name`: Name of the stop
  - `stop_order`: Sequence order on route
  - `estimated_arrival_offset`: Minutes from route start

#### 4. `buses`
**Purpose**: Bus fleet management
- **Primary Key**: `id` (TEXT)
- **Relationships**:
  - `driver_id` → `profiles.id`
- **Key Fields**:
  - `bus_number`: Unique bus identifier
  - `capacity`: Passenger capacity
  - `status`: Current status (`available`, `in_service`, `maintenance`)
  - `current_location`: Real-time location
  - `region`: Operating region

#### 5. `schedules`
**Purpose**: Bus scheduling information
- **Primary Key**: `id` (TEXT)
- **Relationships**:
  - `bus_id` → `buses.id`
  - `route_id` → `routes.id`
- **Key Fields**:
  - `departure_time`: Scheduled departure time
  - `days_of_week`: Operating days (array)
  - `is_active`: Schedule status

### Student & Subscription Management

#### 6. `student_bus_subscriptions`
**Purpose**: Links students to their preferred bus schedules
- **Primary Key**: `id` (TEXT)
- **Relationships**:
  - `student_id` → `profiles.id`
  - `schedule_id` → `schedules.id`

### Trip Management

#### 7. `bus_trips`
**Purpose**: Records individual bus trips
- **Primary Key**: `id` (TEXT)
- **Relationships**:
  - `bus_id` → `buses.id`
  - `route_id` → `routes.id`
  - `schedule_id` → `schedules.id`
  - `driver_id` → `profiles.id`
- **Key Fields**:
  - `departure_time`: Scheduled departure
  - `arrival_time`: Scheduled arrival
  - `status`: Trip status (`scheduled`, `in_progress`, `completed`, `cancelled`)
  - `actual_departure_time`: Real departure time
  - `actual_arrival_time`: Real arrival time
  - `passenger_count`: Number of passengers

### Communication & Announcements

#### 8. `announcements`
**Purpose**: System-wide announcements and notifications
- **Primary Key**: `id` (TEXT)
- **Relationships**:
  - `created_by` → `profiles.id`
- **Key Fields**:
  - `title`: Announcement title
  - `content`: Announcement content
  - `type`: Type (`general`, `emergency`, `maintenance`)
  - `target_audience`: Target users (`all`, `students`, `drivers`, `coordinators`)
  - `priority`: Priority level (`low`, `normal`, `high`, `urgent`)
  - `expires_at`: Expiration timestamp

#### 9. `chat_rooms`
**Purpose**: Chat room management for communication
- **Primary Key**: `id` (TEXT)
- **Key Fields**:
  - `name`: Room name
  - `type`: Room type (`direct`, `group`, `announcement`)
  - `metadata`: Additional room data (JSON)

#### 10. `messages`
**Purpose**: Chat messages within rooms
- **Primary Key**: `id` (TEXT)
- **Relationships**:
  - `chat_room_id` → `chat_rooms.id`
  - `sender_id` → `profiles.id`
- **Key Fields**:
  - `content`: Message content
  - `read`: Read status
  - `metadata`: Additional message data (JSON)

#### 11. `notifications`
**Purpose**: Individual user notifications
- **Primary Key**: `id` (TEXT)
- **Key Fields**:
  - `user_id`: Target user
  - `title`: Notification title
  - `message`: Notification content
  - `type`: Type (`info`, `warning`, `error`, `success`)
  - `is_read`: Read status

### Complaint Management

#### 12. `complaints`
**Purpose**: User complaints and issue tracking
- **Primary Key**: `id` (TEXT)
- **Relationships**:
  - `student_id` → `profiles.id`
  - `bus_id` → `buses.id`
  - `trip_id` → `bus_trips.id`
  - `resolved_by` → `profiles.id`
- **Key Fields**:
  - `complaint_type`: Category of complaint
  - `description`: Detailed description
  - `status`: Resolution status (`pending`, `investigating`, `resolved`, `rejected`)
  - `coordinator_notes`: Internal notes

### Voting & Polling System

#### 13. `voting_topics`
**Purpose**: Topics for community voting and polling
- **Primary Key**: `id` (TEXT)
- **Relationships**:
  - `created_by` → `profiles.id`
  - `bus_id` → `buses.id`
  - `route_id` → `routes.id`
  - `schedule_id` → `schedules.id`
  - `driver_id` → `profiles.id`
- **Key Fields**:
  - `title`: Voting topic title
  - `description`: Detailed description
  - `start_date`: Voting start time
  - `end_date`: Voting end time
  - `status`: Topic status (`draft`, `active`, `completed`, `cancelled`)

#### 14. `voting_options`
**Purpose**: Available options for each voting topic
- **Primary Key**: `id` (TEXT)
- **Relationships**:
  - `topic_id` → `voting_topics.id`
- **Key Fields**:
  - `option_text`: Text description of the option

#### 15. `votes`
**Purpose**: Individual user votes
- **Primary Key**: `id` (TEXT)
- **Relationships**:
  - `student_id` → `profiles.id`
  - `topic_id` → `voting_topics.id`
  - `option_id` → `voting_options.id`

#### 16. `driver_response_pending`
**Purpose**: Pending responses from drivers for voting topics
- **Primary Key**: `id` (TEXT)
- **Relationships**:
  - `topic_id` → `voting_topics.id`
- **Key Fields**:
  - `title`: Request title
  - `region`: Target region
  - `expires_at`: Expiration time

## Enums

### `user_role`
Defines the different types of users in the system:
- `student`: Regular students using the bus service
- `driver`: Bus drivers
- `coordinator`: Campus coordinators managing the system
- `admin`: System administrators

## Database Functions

### 1. `get_expired_driver_requests(p_current_time)`
**Purpose**: Retrieves driver requests that have expired
**Returns**: List of expired requests with details

### 2. `get_topic_bus_details(topic_id)`
**Purpose**: Gets bus information related to a voting topic
**Returns**: Bus ID and number for the topic

### 3. `send_whatsapp_message(phone_number, message)`
**Purpose**: Sends WhatsApp messages (integration placeholder)
**Returns**: Void

## Key Features Supported

### 🚌 **Bus Management**
- Fleet tracking and management
- Driver assignment
- Real-time location updates
- Capacity management

### 🗺️ **Route Management**
- Multi-stop route definition
- Regional campus support
- Estimated travel times
- Stop-by-stop tracking

### 📅 **Scheduling**
- Flexible schedule creation
- Day-of-week patterns
- Student subscriptions
- Schedule activation/deactivation

### 🎯 **Real-time Operations**
- Live trip tracking
- Passenger counting
- Delay monitoring
- Status updates

### 💬 **Communication**
- Multi-channel announcements
- Priority-based messaging
- Chat functionality
- Individual notifications

### 🗳️ **Community Engagement**
- Voting and polling system
- Driver response tracking
- Community feedback
- Decision making tools

### 🔧 **Issue Management**
- Complaint tracking
- Resolution workflow
- Coordinator notes
- Status monitoring

### 👥 **User Management**
- Role-based access
- Multi-campus support
- Profile management
- Contact integration

## Security Features

- **Row Level Security (RLS)** enabled on all tables
- **Role-based access control** through user roles
- **Data isolation** by campus region
- **Audit trails** with created/updated timestamps

## Performance Optimizations

- **Strategic indexing** on frequently queried columns
- **Optimized foreign key relationships**
- **Efficient query patterns** for real-time operations
- **JSON metadata fields** for flexible data storage

This schema provides a robust foundation for a comprehensive campus bus management system with real-time tracking, community engagement, and efficient operations management.