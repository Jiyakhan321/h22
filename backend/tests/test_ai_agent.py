import unittest
from unittest.mock import patch, MagicMock
from src.agents.ai_agent import AIAgent
from src.mcp_tools.task_tools import TaskTools


class TestAIAgent(unittest.TestCase):
    def setUp(self):
        self.agent = AIAgent()

    def test_detect_add_task_intent(self):
        """Test that the agent can detect add task intent"""
        user_message = "Add a task to buy groceries"
        intent_result = self.agent.detect_intent(user_message)
        
        self.assertEqual(intent_result["tool_name"], "add_task")
        self.assertIn("buy groceries", intent_result["params"]["title"].lower())

    def test_detect_list_tasks_intent(self):
        """Test that the agent can detect list tasks intent"""
        user_message = "Show me my tasks"
        intent_result = self.agent.detect_intent(user_message)
        
        self.assertEqual(intent_result["tool_name"], "list_tasks")
        self.assertEqual(intent_result["params"]["status"], "all")

    def test_detect_list_pending_tasks_intent(self):
        """Test that the agent can detect list pending tasks intent"""
        user_message = "Show me my pending tasks"
        intent_result = self.agent.detect_intent(user_message)
        
        self.assertEqual(intent_result["tool_name"], "list_tasks")
        self.assertEqual(intent_result["params"]["status"], "pending")

    def test_detect_complete_task_intent(self):
        """Test that the agent can detect complete task intent"""
        user_message = "Complete task 123e4567-e89b-12d3-a456-426614174000"
        intent_result = self.agent.detect_intent(user_message)
        
        self.assertEqual(intent_result["tool_name"], "complete_task")
        self.assertEqual(intent_result["params"]["task_id"], "123e4567-e89b-12d3-a456-426614174000")

    def test_detect_delete_task_intent(self):
        """Test that the agent can detect delete task intent"""
        user_message = "Delete task 123e4567-e89b-12d3-a456-426614174000"
        intent_result = self.agent.detect_intent(user_message)
        
        self.assertEqual(intent_result["tool_name"], "delete_task")
        self.assertEqual(intent_result["params"]["task_id"], "123e4567-e89b-12d3-a456-426614174000")

    def test_detect_update_task_intent(self):
        """Test that the agent can detect update task intent"""
        user_message = "Update task 123e4567-e89b-12d3-a456-426614174000 to new title"
        intent_result = self.agent.detect_intent(user_message)
        
        self.assertEqual(intent_result["tool_name"], "update_task")
        self.assertEqual(intent_result["params"]["task_id"], "123e4567-e89b-12d3-a456-426614174000")
        self.assertIn("new title", intent_result["params"]["title"])


class TestTaskTools(unittest.TestCase):
    @patch('src.mcp_tools.task_tools.get_session')
    def test_add_task_success(self, mock_get_session):
        """Test that add_task works correctly"""
        # Mock the database session
        mock_session = MagicMock()
        mock_get_session.return_value.__enter__.return_value = mock_session
        
        # Mock the task service
        with patch('src.mcp_tools.task_tools.TaskService') as mock_task_service:
            mock_task = MagicMock()
            mock_task.id = "123e4567-e89b-12d3-a456-426614174000"
            mock_task_service.create_task.return_value = mock_task
            
            result = TaskTools.add_task(
                user_id="user123",
                title="Test task",
                description="Test description"
            )
            
            self.assertTrue(result["success"])
            self.assertEqual(result["task_id"], "123e4567-e89b-12d3-a456-426614174000")
            self.assertIn("added successfully", result["message"])

    @patch('src.mcp_tools.task_tools.get_session')
    def test_list_tasks_success(self, mock_get_session):
        """Test that list_tasks works correctly"""
        # Mock the database session
        mock_session = MagicMock()
        mock_get_session.return_value.__enter__.return_value = mock_session
        
        # Mock the task service
        with patch('src.mcp_tools.task_tools.TaskService') as mock_task_service:
            mock_task = MagicMock()
            mock_task.id = "123e4567-e89b-12d3-a456-426614174000"
            mock_task.title = "Test task"
            mock_task.description = "Test description"
            mock_task.completed = False
            mock_task.priority = "medium"
            mock_task.created_at = "2023-01-01T00:00:00Z"
            mock_task.updated_at = "2023-01-01T00:00:00Z"
            
            mock_task_service.get_tasks_by_user.return_value = [mock_task]
            
            result = TaskTools.list_tasks(user_id="user123", status="all")
            
            self.assertTrue(result["success"])
            self.assertEqual(len(result["tasks"]), 1)
            self.assertEqual(result["tasks"][0]["title"], "Test task")

    @patch('src.mcp_tools.task_tools.get_session')
    def test_complete_task_success(self, mock_get_session):
        """Test that complete_task works correctly"""
        # Mock the database session
        mock_session = MagicMock()
        mock_get_session.return_value.__enter__.return_value = mock_session
        
        # Mock the task service
        with patch('src.mcp_tools.task_tools.TaskService') as mock_task_service:
            mock_task = MagicMock()
            mock_task.id = "123e4567-e89b-12d3-a456-426614174000"
            mock_task.title = "Test task"
            mock_task_service.get_task_by_id_and_user.return_value = mock_task
            mock_task_service.update_task.return_value = mock_task
            
            result = TaskTools.complete_task(
                user_id="user123",
                task_id="123e4567-e89b-12d3-a456-426614174000"
            )
            
            self.assertTrue(result["success"])
            self.assertEqual(result["task_id"], "123e4567-e89b-12d3-a456-426614174000")
            self.assertIn("marked as completed", result["message"])

    @patch('src.mcp_tools.task_tools.get_session')
    def test_delete_task_success(self, mock_get_session):
        """Test that delete_task works correctly"""
        # Mock the database session
        mock_session = MagicMock()
        mock_get_session.return_value.__enter__.return_value = mock_session
        
        # Mock the task service
        with patch('src.mcp_tools.task_tools.TaskService') as mock_task_service:
            mock_task = MagicMock()
            mock_task.id = "123e4567-e89b-12d3-a456-426614174000"
            mock_task.title = "Test task"
            mock_task_service.get_task_by_id_and_user.return_value = mock_task
            mock_task_service.delete_task.return_value = True
            
            result = TaskTools.delete_task(
                user_id="user123",
                task_id="123e4567-e89b-12d3-a456-426614174000"
            )
            
            self.assertTrue(result["success"])
            self.assertEqual(result["task_id"], "123e4567-e89b-12d3-a456-426614174000")
            self.assertIn("deleted successfully", result["message"])

    @patch('src.mcp_tools.task_tools.get_session')
    def test_update_task_success(self, mock_get_session):
        """Test that update_task works correctly"""
        # Mock the database session
        mock_session = MagicMock()
        mock_get_session.return_value.__enter__.return_value = mock_session
        
        # Mock the task service
        with patch('src.mcp_tools.task_tools.TaskService') as mock_task_service:
            mock_task = MagicMock()
            mock_task.id = "123e4567-e89b-12d3-a456-426614174000"
            mock_task_service.get_task_by_id_and_user.return_value = mock_task
            mock_task_service.update_task.return_value = mock_task
            
            result = TaskTools.update_task(
                user_id="user123",
                task_id="123e4567-e89b-12d3-a456-426614174000",
                title="Updated title"
            )
            
            self.assertTrue(result["success"])
            self.assertEqual(result["task_id"], "123e4567-e89b-12d3-a456-426614174000")
            self.assertIn("updated successfully", result["message"])


if __name__ == '__main__':
    unittest.main()