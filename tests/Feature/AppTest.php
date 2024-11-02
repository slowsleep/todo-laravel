<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;

class AppTest extends TestCase
{
    use RefreshDatabase;
    
    /**
     * Проверка главной страницы todo
     * @return void
     * ＠group app
     */
    public function test_index_page_todo(): void
    {
        $response = $this->get('/app');

        $response->assertStatus(200);
    }

    public function test_fail_login()
    {
        $request = $this->post('/api/login', [
            'email' => 'a@b.c',
            'password' => 'secret'
        ]);

        $request->assertStatus(401);
    }

    public function test_task_store()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $request = $this->post('/api/tasks', [
            'title' => 'test',
            'status' => 'backlog',
        ]);

        $request->assertStatus(200)
            ->assertJson([
                'error' => false,
                'message' => 'Task created',
            ]);
    }
}
