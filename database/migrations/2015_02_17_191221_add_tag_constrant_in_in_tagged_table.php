<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddTagConstrantInInTaggedTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
        // Edit 2 column with the same datatype
        DB::statement('ALTER TABLE taggables MODIFY COLUMN tag_id int(10) unsigned');

        \Schema::table('taggables', function($table) {
            $table->foreign('tag_id')->references('id')->on('tagging_tags')->onDelete('cascade')->onUpdate('cascade');
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
