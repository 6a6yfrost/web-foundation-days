# SnapShare: Photo-App Scaling Plan

## 1. Assumptions

SnapShare is a photo-sharing application where users upload photos and scroll through feeds containing photos from people they follow.

The following assumptions are used for this scaling plan:

- Registered users: 10,000,000.
- Daily active users (DAU): 10% of registered users.
- Each daily active user uploads 1 photo per day.
- Each daily active user views 50 feed pages per day.
- Average original photo size: 2 MB.
- Each original photo has one thumbnail of 50 KB.
- One year contains 365 days.
- A day contains 86,400 seconds.
- Storage calculations use decimal units: 1 MB = 1,000 KB, 1 GB = 1,000 MB, and 1 TB = 1,000 GB.
- Traffic is distributed across the day for average-rate calculations.
- Peak traffic is estimated at five times the average traffic.
- The storage estimate excludes database overhead, backups, replicas, temporary files, and additional copies of photos.
- Each photo is stored once as an original and once as a thumbnail.

### Daily Active Users

Daily active users are 10% of the total registered users.

DAU = 10,000,000 × 10%

**DAU = 1,000,000 users per day**

Therefore, SnapShare has approximately 1 million daily active users.

## 2. Traffic and Storage Calculations

### A. Uploads Per Second

Each daily active user uploads one photo per day.

Daily uploads = 1,000,000 × 1

**Daily uploads = 1,000,000 photos**

Average uploads per second:

Uploads per second = 1,000,000 ÷ 86,400

**Average upload rate ≈ 11.57 photos per second**

Estimated peak upload rate:

Peak uploads per second = 11.57 × 5

**Peak upload rate ≈ 57.87 photos per second**

The system should therefore support approximately 58 photo uploads per second during peak periods.

### B. Feed Views Per Second

Each daily active user views 50 feed pages per day.

Daily feed views = 1,000,000 × 50

**Daily feed views = 50,000,000 feed pages**

Average feed views per second:

Feed views per second = 50,000,000 ÷ 86,400

**Average feed rate ≈ 578.70 feed pages per second**

Estimated peak feed views per second:

Peak feed views per second = 578.70 × 5

**Peak feed rate ≈ 2,893.52 feed pages per second**

The system should therefore support approximately 2,894 feed-page requests per second during peak periods.

These figures represent feed-page requests, not individual photo downloads. A single feed page may contain multiple photos, generating additional image requests.

### C. Photo Storage Per Year

Each original photo occupies 2 MB.

Daily original photo storage:

1,000,000 × 2 MB = 2,000,000 MB

**Daily original photo storage = 2 TB**

Annual original photo storage:

2 TB × 365 = **730 TB per year**

Each thumbnail occupies 50 KB, which is 0.05 MB.

Daily thumbnail storage:

1,000,000 × 0.05 MB = 50,000 MB

**Daily thumbnail storage = 50 GB**

Annual thumbnail storage:

50 GB × 365 = 18,250 GB

**Annual thumbnail storage = 18.25 TB per year**

Total annual photo storage:

730 TB + 18.25 TB = **748.25 TB per year**

SnapShare therefore needs approximately 748.25 TB of additional object storage per year for original photos and thumbnails, before accounting for backups, replication, and other overhead.

This estimate assumes that each active user uploads one new photo every day and that previously uploaded photos are retained.

## 3. Is SnapShare Read-Heavy or Write-Heavy?

SnapShare is a **read-heavy system**.

The application receives approximately 50 million feed-page views per day but only 1 million photo uploads per day.

This means there are approximately 50 feed-page requests for every new photo upload.

The architecture should therefore prioritize fast reads and efficient photo delivery. A CDN can serve frequently requested photos, a cache can reduce repeated database queries, and a database read replica can handle read traffic without placing all the load on the primary database.

Photo uploads should also be processed asynchronously where possible so that generating thumbnails does not slow down the upload experience.

## 4. Why Photos Should Not Be Stored Inside the Database

Photo files should not be stored directly inside the relational database because large binary files consume substantial database storage, increase backup and recovery costs, and can make database operations more expensive.

Instead, original photos and thumbnails should be stored in **object storage**, such as Amazon S3 or another compatible object-storage service.

The database should store photo metadata, including the photo ID, owner ID, caption, upload timestamp, object-storage key, and thumbnail key.

This separation allows the application to scale photo storage independently of database capacity and makes it easier to deliver images through a CDN.

## 5. SnapShare Architecture Diagram

```text
                       +----------------------+
                       |        Users         |
                       |  Mobile App / Web    |
                       +----------+-----------+
                                  |
                                  v
                       +----------------------+
                       |         CDN          |
                       | Caches and serves    |
                       | photos and thumbnails|
                       +----------+-----------+
                                  |
                     Feed/API requests and cache misses
                                  |
                                  v
                       +----------------------+
                       |    Load Balancer     |
                       | Distributes incoming |
                       | application requests |
                       +----------+-----------+
                                  |
                     +------------+------------+
                     |            |            |
                     v            v            v
               +----------+ +----------+ +----------+
               | App      | | App      | | App      |
               | Server 1 | | Server 2 | | Server 3 |
               +----+-----+ +----+-----+ +-----+----+
                    |            |             |
                    +------------+-------------+
                                 |
                  +--------------+--------------+
                  |              |              |
                  v              v              v
           +-------------+ +-------------+ +----------------+
           | Cache       | | Primary DB  | | Object Storage |
           |             | |             | | Originals and  |
           | Feed data   | | Users and   | | thumbnails     |
           | and metadata| | photo metadata| |                |
           +-------------+ +------+------+ +--------+-------+
                                  |                   ^
                                  v                   |
                           +-------------+            |
                           | Read Replica|            |
                           | Handles DB  |            |
                           | read queries|            |
                           +-------------+            |
                                                      |
                           +-------------+            |
                           | Job Queue   |            |
                           | Thumbnail   |            |
                           | jobs        |            |
                           +------+------+            |
                                  |                   |
                                  v                   |
                           +-------------+            |
                           | Thumbnail   |------------+
                           | Worker      |
                           | Creates     |
                           | thumbnails  |
                           +-------------+
```

**Diagram note:** The CDN serves cached images directly to users. API requests pass through the load balancer to the application servers. The application servers use the cache and database for feed metadata, while original photos and thumbnails live in object storage. After a photo is uploaded, a thumbnail job is placed on the queue for a worker to process asynchronously.

## 6. What Each Component Does

1. **Users:** Upload photos and request feeds through the web or mobile application.

2. **CDN:** Caches and delivers photos and thumbnails from locations close to users, reducing latency and load on the origin storage.

3. **Load balancer:** Distributes incoming API requests across healthy application servers to prevent any one server from becoming overloaded.

4. **Application servers:** Handle authentication, upload authorization, feed generation, metadata operations, and communication with other services.

5. **Cache:** Stores frequently requested feed data and metadata so the application does not need to query the database for every request.

6. **Primary database:** Stores authoritative user records, photo metadata, relationships between users, and other structured application data.

7. **Database read replica:** Serves eligible read queries to reduce the read workload on the primary database.

8. **Object storage:** Stores original photo files and generated thumbnails independently of the relational database.

9. **Job queue:** Holds thumbnail-generation jobs so that image processing can happen in the background without blocking the upload request.

10. **Thumbnail worker:** Retrieves queued jobs, generates smaller versions of uploaded photos, saves the thumbnails to object storage, and updates their metadata when necessary.

## 7. Step-by-Step Photo Upload Flow

1. **User selects a photo:** The user selects a photo in the SnapShare application and submits it for upload.

2. **Application authenticates the user:** The application server verifies the user's identity and checks whether the user is authorized to upload the photo.

3. **Upload authorization is created:** The application server generates a short-lived, restricted upload URL or equivalent authorization for object storage.

4. **Original photo is uploaded:** The client uploads the original photo directly to object storage using the authorized upload URL. This avoids routing the entire 2 MB file through the application server.

5. **Upload is confirmed:** After the upload succeeds, the application verifies that the expected object exists and that the upload is valid.

6. **Metadata is saved:** The application writes the photo metadata to the primary database, including the owner, object-storage key, caption, timestamp, and processing status.

7. **Thumbnail job is queued:** The application adds a thumbnail-generation job to the queue. The job contains the photo ID and the location of the original file.

8. **Worker processes the job:** A thumbnail worker retrieves the job and downloads or reads the original photo from object storage.

9. **Thumbnail is generated:** The worker resizes and compresses the original photo to create a 50 KB thumbnail target, subject to image content and compression settings.

10. **Thumbnail is stored:** The worker uploads the generated thumbnail to object storage and records its object key in the database.

11. **Processing status is updated:** The application marks the thumbnail as ready so that feed requests can use it.

12. **Photo appears in feeds:** When another user views a relevant feed, the application returns the photo metadata and thumbnail URL. The CDN serves the thumbnail when available in its cache, while the original can be requested when needed.

If thumbnail processing fails, the queue should support retries and failed-job monitoring. The original photo should remain available even if thumbnail generation is delayed.

## 8. Scaling Trade-Offs

### Trade-Off 1: CDN Caching vs. Freshness

**Advantage:** A CDN reduces image-loading latency and decreases requests reaching object storage, making photo delivery faster and more scalable.

**Disadvantage:** Cached content can become stale if a photo is deleted, replaced, or access permissions change.

**Decision:** Use versioned photo URLs, suitable cache expiration policies, and invalidation or authorization controls for sensitive content.

### Trade-Off 2: Database Read Replica vs. Strong Consistency

**Advantage:** A read replica distributes read queries away from the primary database and improves the system's ability to handle heavy feed traffic.

**Disadvantage:** Replication can lag behind the primary database, so a newly uploaded photo or updated metadata might not appear immediately in replica-backed reads.

**Decision:** Use the read replica for ordinary feed reads where slight delays are acceptable. Use the primary database for operations that require the latest authoritative state.

### Trade-Off 3: Asynchronous Thumbnail Generation vs. Immediate Availability

**Advantage:** A job queue allows photo uploads to finish without waiting for thumbnail generation and allows workers to scale independently.

**Disadvantage:** Users may briefly see a placeholder while a thumbnail is being generated, and failed jobs require retries and monitoring.

**Decision:** Process thumbnails asynchronously, show a temporary placeholder when necessary, and implement retry handling and failed-job alerts.

### Trade-Off 4: Object Storage vs. Simpler File Management

**Advantage:** Object storage scales independently, handles large volumes of files, and integrates well with CDN delivery.

**Disadvantage:** The application must manage object keys, upload authorization, deletion, access permissions, and consistency between database records and stored files.

**Decision:** Keep metadata in the database, store files in object storage, and implement reliable cleanup and access-control procedures.

## 9. Conclusion

SnapShare has approximately 1 million daily active users, 11.57 average photo uploads per second, and 578.70 average feed-page views per second. At peak traffic, the system should support approximately 58 uploads and 2,894 feed-page requests per second.

The application is read-heavy, so the architecture prioritizes CDN delivery, caching, and database read replicas. Object storage handles original photos and thumbnails, while a queue and background workers process thumbnails asynchronously.

This design separates photo storage, metadata management, and image processing so that each component can scale according to its workload.