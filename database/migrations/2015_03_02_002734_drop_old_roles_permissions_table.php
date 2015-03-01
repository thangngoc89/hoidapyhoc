<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DropOldRolesPermissionsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
        DB::transaction(function()
        {
            DB::statement('SET FOREIGN_KEY_CHECKS = 0');
            Schema::drop('permissions');
            Schema::drop('permission_role');
            Schema::drop('roles');
            Schema::drop('assigned_roles');
            DB::statement('SET FOREIGN_KEY_CHECKS = 1');
        });

    }

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		//
	}

}
