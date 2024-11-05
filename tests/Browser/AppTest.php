<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;
use App\Models\User;

class AppTest extends DuskTestCase
{
    use DatabaseMigrations;

    /**
     * A Dusk test example.
     * @group fail
     */
    public function test_fail_login(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/app')
                    ->type('email', fake()->email)
                    ->type('password', fake()->password)
                    ->press('Sign In')
                    ->assertSee('Please Sign In to see your tasks!');
        });
    }

    /**
     * A Dusk test example.
     * @group ok
     */
    public function test_ok_login(): void
    {
        $user = User::factory()->create();

        $this->browse(function (Browser $browser) use ($user) {
            $browser->visit('/app')
            ->type('email', $user->email)
            ->type('password', 'password')
            ->press('Sign In')
            ->pause(1000)
            ->screenshot('test_ok_login')
            ->assertSee('Здравствуйте, '.$user->name);
        });
    }
}
