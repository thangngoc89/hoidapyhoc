<?php
use Illuminate\Database\Migrations\Migration;

class FileTable extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('files', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->unsignedInteger('test_id');
            $table->string('orginal_filename');
            $table->string('filename')->unique();
            $table->string('size');
            $table->unique('filename');

            $table->foreign('test_id')->references('id')->on('tests')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {

        Schema::drop('files');
    }

}
