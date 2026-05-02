The first stage of the project is the Notification System API Design.

## Overview
The notification system will be used to notify the users of relevant updates like placements, results and events. Such basic functions as creating, getting, and updating notifications, real time delivery should be supported by the system.

## Core Features
- Create new notifications
- Retrieve user-specific notifications
- Mark as read.
- Give live updates to the users.

## API Endpoints

### Create Notification
**POST /notifications**

used to make a new notification to a user.

---

### Get Notifications
**GET /notifications?userId=123**

Gets all the notifications of a particular user.

---

This will mark the notification as read.
**PATCH /notifications/:id/read**

Indicates having read a specific notification.

---

## Real-Time Mechanism
WebSockets can be employed to make sure that the users are provided with updates in real time. This enables the server to send notifications to the client without having to make multiple API calls.

---

# Stage 2: Database Design

To store such notifications consistently, a relational database such as PostgreSQL can be a good option because of its high consistency and the ability to have indexes.

## Table Structure

The notifications table may consist of the following fields:
- id (unique identifier)
- user-id (to recognize the user)
- placement (result, type, event)
- message (notification content)
- is_read (boolean flag)
- created_at (timestamp)

## Optimization Strategy
Indexing should be done on: to enhance query performance.
(user_id, is_read, created_at)

## Handling Large Data
Performance may suffer as the number of notifications increases. To handle this:
- Indexing: Use indexing to get quicker lookups.
- Pagination to restrict results.
- cache (e.g. Redis) regularly accessed data.

---

# Stage 3: Query Optimization

The specified query retrieves unread notifications of a student, and arranges them in time order. Nonetheless, it may get slow as the dataset increases.

## Problem
- The database will have to do a full table scan without indexing.
- Location of large datasets makes response time longer.

## Solution
Construct a composite measure on:
(studentID, isRead, createdAt)

## Result
- Fasts up query complexity (O(n)) to about O(log n).
- Enhances the general response time.

## Important Note
It is not advisable to add indexes on all the columns since it:
- Reduces the speed of insert/update.
- Increases storage overhead

---

# Stage 4: Performance Improvement

Delivering notifications each page load may overwhelm the database and detract the user experience.

## Proposed Solutions
- Cache with Redis common notifications.
- Paginate to reduce the number of records to be fetched.
- lazy-loading to load data on demand.
- Push updates over WebSockets, rather than polling.

## Trade-offs
Caching enhances performance but creates problems such as invalidation of cache and consistency of data.

---

# Stage 5: Scalability

A synchronous strategy is ineffective when it is necessary to send notifications to a great number of users (e.g., 50,000).

Problems with Existing Method.
- Processing is slow in a sequence.
- Malfunctions may disrupt the whole process.
- No retry mechanism

## Improved Approach
Message queue system e.g. Kafka, RabbitMQ.

## Benefits
- Enables asynchronous processing
- Supports retry mechanisms
- Does not impact the whole system.

## Design Principle
Loosely couple keep services to enhance maintainability and scalability.

---

# Stage 6: Priority Logic

The priority of notifications should be in terms of importance and timeliness.

## Priority Order
Placement > Result > Event

## Sorting Logic
1. Organize notifications by priority.
2. When there is an equality in priorities sorting is against time (last added first).

## Output
Receive the top 10 notifications.

## Optimization
A min-heap can be employed to effectively retain the best notifications, as opposed to sorting the whole data set.