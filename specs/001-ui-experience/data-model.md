# Data Model: Frontend UI Components & State

**Created**: 2026-01-22
**Feature**: Frontend UI & User Experience

## Component State Models

### Task Item Component State

**Properties**:
- `id`: string (required) - Unique identifier for the task
- `title`: string (required, 1-200 chars) - Task title displayed to user
- `description`: string (optional, 0-1000 chars) - Detailed task description
- `completed`: boolean (required) - Whether task is marked as completed
- `priority`: string (required) - Priority level ("low", "medium", "high")
- `createdAt`: Date (required) - When task was created
- `updatedAt`: Date (required) - When task was last updated
- `isEditing`: boolean (optional) - Whether task is in editing mode
- `isLoading`: boolean (optional) - Whether task operation is in progress
- `error`: string (optional) - Error message if operation failed

**Validation Rules**:
- `id` must be a valid UUID format
- `title` must be 1-200 characters
- `description` must be 0-1000 characters if provided
- `completed` must be boolean
- `priority` must be one of "low", "medium", "high"
- `createdAt` and `updatedAt` must be valid dates

### Task List Component State

**Properties**:
- `tasks`: Array<TaskItem> (required) - List of task items
- `filter`: string (required) - Current filter state ("all", "active", "completed")
- `sortOrder`: string (required) - Sort order ("date", "priority", "title")
- `isLoading`: boolean (required) - Whether data is being loaded
- `error`: string (optional) - Error message if loading failed
- `hasMore`: boolean (optional) - Whether more tasks are available (for pagination)

**Validation Rules**:
- `tasks` must be an array of valid TaskItem objects
- `filter` must be one of "all", "active", "completed"
- `sortOrder` must be one of "date", "priority", "title"
- `isLoading` must be boolean
- `hasMore` must be boolean if present

### Task Form Component State

**Properties**:
- `formData`: object (required) - Current form field values
  - `title`: string - Current title value
  - `description`: string - Current description value
  - `priority`: string - Current priority selection
- `errors`: object (optional) - Field-specific validation errors
- `isSubmitting`: boolean (required) - Whether form submission is in progress
- `successMessage`: string (optional) - Success message after submission

**Validation Rules**:
- `formData.title` must follow TaskItem title validation rules
- `formData.description` must follow TaskItem description validation rules
- `formData.priority` must follow TaskItem priority validation rules
- `errors` keys must match form field names
- `isSubmitting` must be boolean

### Authentication State

**Properties**:
- `isAuthenticated`: boolean (required) - Whether user is currently authenticated
- `user`: object (optional) - User profile information
  - `id`: string - User ID
  - `email`: string - User's email address
  - `firstName`: string (optional) - User's first name
  - `lastName`: string (optional) - User's last name
- `isLoading`: boolean (required) - Whether auth status is being determined
- `error`: string (optional) - Error message if auth failed

**Validation Rules**:
- `isAuthenticated` must be boolean
- When `isAuthenticated` is true, `user` must be present
- When `isAuthenticated` is false, `user` must be null/undefined
- `isLoading` must be boolean

## UI State Management

### Global Application State

**Properties**:
- `auth`: Authentication State (required) - User authentication information
- `tasks`: Task List State (required) - Current task list and filter state
- `ui`: UI State (required) - Global UI state
  - `notifications`: Array<Notification> - Active notifications
  - `loadingStates`: object - Loading states for different operations
  - `errors`: Array<Error> - Active error messages

### Notification Model

**Properties**:
- `id`: string (required) - Unique notification identifier
- `type`: string (required) - Type of notification ("success", "error", "info", "warning")
- `message`: string (required) - Notification message content
- `timestamp`: Date (required) - When notification was created
- `duration`: number (optional) - Duration in milliseconds before auto-dismissal

**Validation Rules**:
- `id` must be unique within active notifications
- `type` must be one of "success", "error", "info", "warning"
- `message` must be non-empty string
- `timestamp` must be valid date
- `duration` must be positive number if present

## Component Interaction Patterns

### Task Management Workflow States

1. **Initial Load State**:
   - `tasks.isLoading` = true
   - `tasks.tasks` = empty array
   - `tasks.error` = null

2. **Loaded State**:
   - `tasks.isLoading` = false
   - `tasks.tasks` = populated with user's tasks
   - `tasks.error` = null

3. **Task Creation State**:
   - `taskForm.isSubmitting` = true
   - `taskForm.formData` = contains new task data
   - `taskForm.error` = null (during submission)

4. **Task Update State**:
   - `taskItem.isLoading` = true (for specific task)
   - `taskItem.isEditing` = false
   - UI shows updated data after successful completion

5. **Error State**:
   - `tasks.error` or `taskForm.error` contains error message
   - Appropriate error UI is displayed
   - User is informed of possible recovery actions

### Responsive Design States

**Breakpoint Definitions**:
- `mobile`: 320px - 767px
- `tablet`: 768px - 1023px
- `desktop`: 1024px+

**Component Adaptations**:
- Navigation: Collapses to hamburger menu on mobile, expands on desktop
- Task List: Single column on mobile, multi-column on desktop
- Forms: Full width on mobile, compact layout on desktop
- Buttons: Larger touch targets on mobile, precise controls on desktop

## API State Synchronization

### Client-Backend State Alignment

The UI maintains consistency with backend state through:

1. **Initial Load**: Fetch current state from backend when component mounts
2. **Operation Feedback**: Show immediate UI feedback for user actions (optimistic updates)
3. **Backend Confirmation**: Update UI with actual backend state after API response
4. **Error Recovery**: Revert UI changes if backend operation fails
5. **Real-time Updates**: Poll or use websockets for external state changes (future enhancement)

### Loading State Management

**Types of Loading States**:
- `global`: Entire page is loading (initial load)
- `section`: Specific section of page is loading (individual task update)
- `element`: Specific element is processing (button click)
- `background`: Background operation (periodic sync)

**Loading Indicators**:
- Skeleton screens during initial load
- Progress bars for file uploads
- Spinners for API calls
- Inline loading indicators for specific elements