<?php namespace Quiz\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Quiz\Models\Upload
 *
 * @property integer $id 
 * @property string $filename 
 * @property string $orginal_filename 
 * @property string $location 
 * @property string $extension 
 * @property string $mimetype 
 * @property integer $size 
 * @property integer $user_id 
 * @property \Carbon\Carbon $created_at 
 * @property \Carbon\Carbon $updated_at 
 * @property-read \Quiz\Models\User $user 
 * @property-read \Illuminate\Database\Eloquent\Collection|\$related[] $morphedByMany 
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Upload whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Upload whereFilename($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Upload whereOrginalFilename($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Upload whereLocation($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Upload whereExtension($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Upload whereMimetype($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Upload whereSize($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Upload whereUserId($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Upload whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Upload whereUpdatedAt($value)
 */
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
