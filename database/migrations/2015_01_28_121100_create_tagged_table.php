<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
class CreateTaggedTable extends Migration {
    public function up() {
        \Schema::create('taggables', function(Blueprint $table) {
            $table->integer('tag_id')->index();
            $table->integer('taggable_id')->index();
            $table->string('taggable_type', 255)->index();
        });
    }
    public function down() {
        \Schema::drop('taggables');
    }
}