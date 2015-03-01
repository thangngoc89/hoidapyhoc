<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Quiz\Models\Role;
use Quiz\Models\User;

class RolesTableSeeder extends Seeder {

    public function run()
    {
        DB::table('roles')->delete();

        $adminRole = new Role;
        $adminRole->name = 'admin';
        $adminRole->save();

        $user = User::where('username','khoanguyen')->first();
        $user->attachRole($adminRole);
    }

}
