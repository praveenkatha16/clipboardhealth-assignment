# Ticket Breakdown

We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**

Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".

You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

Assuming following database schema:

| Column Name           | Data Type    | Primary Key | Not Null |
| --------------------- | ------------ | ----------- | -------- |
| id                    | int          | Yes         | Yes      |
| facility_name         | varchar(255) | No          | Yes      |
| facility_address      | varchar(255) | No          | Yes      |
| facility_contact_info | varchar(255) | No          | No       |

# Agents table

| Column Name        | Data Type     | Primary Key | Not Null |
| ------------------ | ------------- | ----------- | -------- |
| id                 | int           | Yes         | Yes      |
| agent_name         | varchar(255)  | No          | Yes      |
| agent_contact_info | varchar(255)  | No          | No       |
| agent_hourly_rate  | decimal(10,2) | No          | Yes      |

# Shifts table

| Column Name      | Data Type    | Primary Key | Not Null | Foreign Key   |
| ---------------- | ------------ | ----------- | -------- | ------------- |
| id               | int          | Yes         | Yes      |               |
| facility_id      | int          | No          | Yes      | Facilities.id |
| agent_id         | int          | No          | Yes      | Agents.id     |
| shift_start_time | datetime     | No          | Yes      |               |
| shift_end_time   | datetime     | No          | Yes      |               |
| shift_duration   | decimal(5,2) | No          | Yes      |

Also assuming the relationship between Agents and Facilities is many-to-many, meaning that an Agent can work with multiple Facilities and a Facility can have multiple Agents working for them.

Here is the ticket breakdown:

# Ticket 1: Create `facility_agents` table

## Description

Create a new table called `facility_agents` to establish a many-to-many relationship between Facilities and Agents. This will allow Facilities to save their own custom ids for each Agent they work with.

## Acceptance Criteria

- A new table `facility_agents` is created with columns "id", `facility_id`, `agent_id`, and `custom_id`.
- The `id` column is set to auto-increment and designated as the primary key.
- The `facility_id` and `agent_id` columns are designated as foreign keys referencing the "id" columns of their respective tables.
- The `custom_id` column is nullable and allows Facilities to save their own custom id for each Agent.
- Each combination of `facility_id` and `agent_id` must be unique.

## Table: `facility_agents`

| Column      | Data Type    | Primary Key | Not Null | Foreign Key   |
| ----------- | ------------ | ----------- | -------- | ------------- |
| id          | int          | Yes         |          |               |
| facility_id | int          |             | Yes      | Facilities.id |
| agent_id    | int          |             | Yes      | Agents.id     |
| custom_id   | varchar(255) |             |          |               |

## Time/Effort Estimate

2 hours

## Implementation Details

- Create a new migration file to generate the `facility_agents` table.
- Use the appropriate migration commands to create the table with the correct columns and constraints.

## Ticket 2: Implement Updating Custom IDs via an Interface

### Description

Add an interface that allows Facilities to update `custom_id` values for their Agents. Validate that the `custom_id` is unique before saving it to the database.

### Acceptance Criteria

- Facilities can update `custom_id` values for their Agents via the interface.
- Custom IDs are unique for each Agent and do not clash with any other `custom_id` already present in the `facility_agents` table.
- The interface validates the `custom_id` for uniqueness before saving it to the database.

### Time/Effort Estimate

3-4 hours

### Implementation Details

- Create an interface for Facilities to update `custom_id` values for their Agents.
- Allow Facilities to select an Agent and enter a `custom_id` value.
- Validate that the `custom_id` is unique before saving it to the database.
- Write tests to ensure the interface behaves correctly and the `custom_id` validation works as expected.

# Ticket 3: Modify `getShiftsByFacility` to include custom ids

## Description

Modify the `getShiftsByFacility` function to include the custom id of each Agent, if available, in addition to their internal database id.

## Acceptance Criteria

- The `getShiftsByFacility` function is modified to include the custom id of each Agent, if available, in addition to their internal database id.
- If a custom id is not available, the function will return only the internal database id.

## Time/Effort Estimate

1 hour

## Implementation Details

- Update the SQL query in the `getShiftsByFacility` function to include a join on the `facility_agents` table.
- Retrieve the custom id if available, otherwise retrieve the internal database id.

# Ticket 4: Modify `generateReport` to use custom ids

## Description

Modify the `generateReport` function to use the custom id of each Agent, if available, instead of their internal database id on the reports generated for Facilities.

## Acceptance Criteria

- The `generateReport` function is modified to use the custom id of each Agent, if available, instead of their internal database id on the reports generated for Facilities.
- If a custom id is not available, the function will use the internal database id.

## Time/Effort Estimate

1 hour

## Implementation Details

- Update the code in the `generateReport` function to use the custom id if available, otherwise use the internal database id.
