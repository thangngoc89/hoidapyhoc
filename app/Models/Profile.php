<?php namespace Quiz\Models;

use Quiz\Models\User;
use Illuminate\Database\Eloquent\Model;

/**
 * Quiz\Models\Profile
 *
 * @property integer $id 
 * @property integer $user_id 
 * @property string $provider 
 * @property string $identifier 
 * @property string $profileURL 
 * @property string $photoURL 
 * @property string $displayName 
 * @property string $gender 
 * @property string $language 
 * @property string $email 
 * @property \Carbon\Carbon $created_at 
 * @property \Carbon\Carbon $updated_at 
 * @property-read \user $user 
 * @property-read \Illuminate\Database\Eloquent\Collection|\$related[] $morphedByMany 
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Profile whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Profile whereUserId($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Profile whereProvider($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Profile whereIdentifier($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Profile whereProfileURL($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Profile wherePhotoURL($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Profile whereDisplayName($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Profile whereGender($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Profile whereLanguage($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Profile whereEmail($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Profile whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Profile whereUpdatedAt($value)
 */
class Profile extends Model {

    protected $guarded = [];

    protected $table = 'users_profile';
    public function user()
    {
        return $this->belongsTo('user');
    }
    public function findOrCreateProfile($user, $userData,$provider)
    {
        $profile = Profile::where('provider',$this->convertProviderName($provider))
            ->where('identifier',$userData->id)
            ->where('email',$userData->email)
            ->first();

        if (is_null($profile))
        {
            $profile = new Profile([
                'user_id' => $user->id,
                'provider' => $this->convertProviderName($provider),
                'identifier' => $userData->id,
                'photoURL' => $userData->avatar,
                'profileURL' => $userData->user['link'],
                'gender' => $userData->user['gender'],
                'language'  => $userData->user['locale'],
                'email' => $userData->email,
                'displayName' => $userData->user['name'],
            ]);
            $profile->save();
        }

    }

    private function convertProviderName($provider)
    {
        switch($provider)
        {
            case 'facebook' : return 'Facebook';
            case 'google' : return 'Google';
        }
    }

}