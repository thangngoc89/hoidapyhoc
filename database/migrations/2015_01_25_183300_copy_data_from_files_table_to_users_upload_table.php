<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CopyDataFromFilesTableToUsersUploadTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		$tests = \Quiz\Models\Exam::has('file')->get();
        foreach ($tests as $t)
        {
            // Copy file to users_upload table
            $file = $t->file()->first();
            $newUpload = new \Quiz\Models\Upload;
            $newUpload->filename = $file->filename;
            $newUpload->orginal_filename = $file->orginal_filename;
            $newUpload->extension = 'pdf';
            $newUpload->mimetype = 'application/pdf';
            $newUpload->size = $file->size;
            $newUpload->user_id = $t->user_id;
            $newUpload->location = 's3';
            $newUpload->save();

            //Update file_id to tests table
            $t->file_id = $newUpload->id;
            $t->save();
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
