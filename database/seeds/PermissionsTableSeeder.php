<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Quiz\Models\Enstrust\Role;
use Quiz\Models\User;

class PermissionsTableSeeder extends Seeder {

    public function run()
    {
        DB::table('permissions')->delete();

        $permissions = array(
            array( // 1
                'name'         => 'manage_exams',
                'display_name' => 'Manage Exams'
            ),
            array( // 3
                'name'         => 'manage_users',
                'display_name' => 'Manage Users'
            ),
            array( // 4
                'name'         => 'manage_roles',
                'display_name' => 'Manage Roles'
            )
        );

        DB::table('permissions')->insert( $permissions );

        DB::table('permission_role')->delete();

        $role_id_admin = Role::where('name', 'admin')->first()->id;

        $permission_base = (int)DB::table('permissions')->first()->id - 1;

        $permissions = array(
            array(
                'role_id'       => $role_id_admin,
                'permission_id' => $permission_base + 1
            ),
            array(
                'role_id'       => $role_id_admin,
                'permission_id' => $permission_base + 2
            ),
            array(
                'role_id'       => $role_id_admin,
                'permission_id' => $permission_base + 3
            )
        );

        DB::table('permission_role')->insert( $permissions );
    }

}