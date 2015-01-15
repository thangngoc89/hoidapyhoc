<?php
use Illuminate\Database\Migrations\Migration;

class QuizTable extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('categories', function($table)
        {

            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('name');
            $table->string('description')->nullable();
            $table->string('color',6)->default('FF0000');
            $table->string('slug');
            $table->unique('slug');
            $table->timestamps();
        });

        Schema::create('tests', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id')->index();
            $table->string('name');

            $table->string('slug',40);
            $table->unique('slug');

            $table->text('description');
            $table->text('content')->nullable();

            $table->Integer('thoigian');
            $table->unsignedInteger('cid')->nullable();
            $table->unsignedInteger('user_id')->index();
            $table->unsignedInteger('user_id_edited')->nullable()->index();
            $table->Integer('luotthi')->nullable()->default(0);
            $table->Integer('begin')->nullable()->default(1);

            $table->boolean('is_file')->default(0);
            $table->boolean('is_approve')->default(0);

            $table->foreign('user_id')->references('id')->on('users')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            $table->foreign('user_id_edited')->references('id')->on('users')
                ->onDelete('set null')
                ->onUpdate('cascade');
            $table->foreign('cid')->references('id')->on('categories')
                ->onDelete('set null')
                ->onUpdate('cascade');

            $table->timestamps();
        });
        Schema::create('questions', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id')->index();
            $table->text('content');
            $table->string('right_answer');
            $table->unsignedInteger('test_id')->index();

            $table->foreign('test_id')->references('id')->on('tests')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            #$table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {

        Schema::drop('questions');
        Schema::drop('tests');
        Schema::drop('categories');
    }

}
