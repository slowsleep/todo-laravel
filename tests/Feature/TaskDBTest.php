<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Task;
use App\Services\TaskService;

class TaskDBTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Count created tasks
     * 1 assert
     */
    public function test_count_created_tasks(): void
    {
        $user = User::factory()->create();
        $user->tasks()->create([
            'title' => 'test',
            'status' => 'backlog',
        ]);

        $user->tasks()->create([
            'title' => 'test2',
            'status' => 'backlog',
        ]);

        $this->assertDatabaseCount('tasks', 2);
    }

    /**
     * Mock tasks by user
     * 3 asserts
     * @group dbmock
     */
    public function test_mock_tasks_by_user(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $taskMock = Task::factory()->count(2)->make([
            'user_id' => $user->id,
        ]);

        $mock = $this->partialMock(TaskService::class, function ($mock) use ($taskMock) {
            $mock->shouldReceive('getTasks')->once()->andReturn($taskMock->toArray());
        });

        $tasks = $mock->getTasks();

        $this->assertIsArray($tasks);
        $this->assertEquals(2, count($tasks));
        $this->assertEquals($tasks, $taskMock->toArray());

    }
}
