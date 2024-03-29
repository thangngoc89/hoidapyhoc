<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
class CreateTagsTable extends Migration {
    public function up()
    {
        \Schema::create('tagging_tags', function(Blueprint $table) {
            $table->increments('id')->index();
            $table->string('slug', 255)->index();
            $table->string('name', 255);
            $table->string('description')->nullable();
            $table->boolean('suggest')->default(false);
        });
    }
    public function down()
    {
        \Schema::drop('tagging_tags');
    }
}