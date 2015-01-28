<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Quiz\Models\Exam;

class TagAllTestWithItsCategory extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		$test = Exam::all();
        foreach ($test as $t)
        {
            $tag = $t->category->name;
            $t->retag($tag);
        }
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
