<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;
use App\Models\User;

class AppTaskTest extends DuskTestCase
{
    use DatabaseMigrations;
    
    /**
     * Test show user's tasks
     */
    public function test_show_user_tasks(): void
    {
        $user = User::factory()->create();

        $user->tasks()->create([
            'title' => 'mytest123',
            'status' => 'backlog',
        ]);

        $user->tasks()->create([
            'title' => 'help grandma',
            'status' => 'finished',
        ]);

        $this->browse(function (Browser $browser) use ($user) {
            $browser
                ->loginAs($user->id)
                ->visit('/app')
                ->screenshot('test_app_task')
                ->assertAuthenticatedAs($user)
                ->assertSee('mytest123');
        });
    }
}
