<?php namespace Quiz\Models;

use Illuminate\Database\Eloquent\Model;

class Upload extends Model {

    protected $table = 'users_upload';

    protected $fillable = array('filename','orginal_filename','size','mimetype','extension');

    public static function boot()
    {
        Upload::saving(function($upload)
        {
            $upload->location = config('filesystems.default');
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
        switch($this->location)
        {
            case 'local' :
                return url('/uploads/'.$this->filename);
                break;
        }
    }
}
