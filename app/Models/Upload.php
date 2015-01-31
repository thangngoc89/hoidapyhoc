<?php namespace Quiz\Models;

use Illuminate\Database\Eloquent\Model;

class Upload extends Model {

    protected $table = 'users_upload';

    protected $fillable = array('filename','orginal_filename','size','mimetype','extension');

    public static function boot()
    {
        Upload::saved(function($upload)
        {
            // Backup file to Amazon S3
        });
    }

    /*
     * Belongs to
     */
    public function user()
    {
        return $this->belongsTo('Quiz\Models\User');
    }

    public function url()
    {
        if($this->location == 's3')
            return '//media.hoidapyhoc.com/'.$this->filename;

        if(in_array($this->extension, ['png','jpeg','jpg','gif']))
            return url("/files/image/{$this->filename}");

        return url('/uploads/'.$this->filename);
    }

    public function pdfViewer()
    {
        if ($this->extension != 'pdf')
            return false;
        return getenv('PDF_VIEWER').$this->url();
    }
}
