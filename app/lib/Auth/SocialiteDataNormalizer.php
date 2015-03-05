<?php namespace Quiz\lib\Auth;

class SocialiteDataNormalizer {

    /**
     * @param $data
     * @return $data
     */
    public function normalizer($data)
    {
        switch ($data->provider)
        {
            case 'facebook' :
                return $this->facebookNormalizer($data);
            case 'google' :
                return $this->googleNormalizer($data);
            default :
                return $data;
        }

    }

    /* Facebook example data
        $userData = [
            'token'     => 'CAAF0J5ZCwNXgBAKdE0xP9xZA026qKZCA6uBwSbKZCXUxftZBEHhJ9bq5NzLNwZAuK30rZBZCxZBsE5tF1fdGxLZA11AK6GnFHUH4Rdt7U2HeztrxousZApZAxTE88pSGfl8cJbHIiySSDq7TYsWddc8Uet6KVAlvQdfvcPz1x4oaQBhNRBK6rZBLmm308tt3MEceL1hCZBptMVdYRsTc9dRzlcbG6kmwnhbfZCe4AIZD',
            'id'        => '795824050479589',
            'nickname'  => null,
            'name'      => 'Nguyễn Khoa',
            'email'     => 'contact@tienganhratde.com',
            'avatar'    => 'https://graph.facebook.com/v2.2/795824050479589/picture?type=normal',
            'user'      => [
                "id"            => "795824050479589",
                "email"         => "contact@tienganhratde.com",
                "first_name"    => "Nguyễn",
                "gender"        => "male",
                "last_name"     => "Khoa",
                "link"          => "https://www.facebook.com/app_scoped_user_id/795824050479589/",
                "locale"        => "en_GB",
                "middle_name"   => "Đăng",
                "name"          => "Nguyễn Đăng Khoa",
                "timezone"      => 7,
                "updated_time"  => "2014-12-24T09:40:57+0000",
                "verified"      => true,
            ]
        ];
     */
    private function facebookNormalizer($data)
    {
        return (object)[
            'token' => $data->token,
            'id'    => $data->id,
            'provider' => $data->provider,
            'identifier' => $data->id,
            'photoURL' => ($data->avatar) ?: null,
            'profileURL' => isset($data->user['link']) ? $data->user['link'] : null,
            'gender' => isset($data->user['gender']) ? $data->user['gender'] : null,
            'language' => isset($data->user['locale']) ? $data->user['locale'] : null,
            'email' => ($data->email) ?: null,
            'displayName' => $data->name,
        ];
    }

    /* Google exam data
        $userData = [
            "token" => "ya29.LQHyCJmehw24JENjhQ0CB8hcdojrOYmqXw11AW4Mvs02I0JQGa4baQSGjvjUWnAZczogTsQX3L_kAw",
            "id"    => "104882166677256893566",
            "nickname" => null,
            "name" => "Hồng Xuân",
            "email" => "khianhyeutrieutraitimtanvo1001@gmail.com",
            "avatar" => "https://lh4.googleusercontent.com/-9Z5KBDcAZMQ/AAAAAAAAAAI/AAAAAAAAAB4/1xfFVpg068w/photo.jpg?sz=50",
            "user" => [
                "kind" => "plus#person",
                "etag" => '"RqKWnRU4WW46-6W3rWhLR9iFZQM/sJVIzFWdI9WMovxo5jxZzquoFZc"',
                "gender" => "female",
                "emails" => [
                    0 => [
                        "value" => "khianhyeutrieutraitimtanvo1001@gmail.com",
                        "type" => "account"
                    ]
                ],
                "objectType" => "person",
                "id" => "104882166677256893566",
                "displayName" => "Hồng Xuân",
                "name" => [
                    "familyName" => "Xuân",
                    "givenName" => "Hồng",
                ],
                "url" => "https =>//plus.google.com/104882166677256893566",
                "image" => [
                    "url" => "https://lh4.googleusercontent.com/-9Z5KBDcAZMQ/AAAAAAAAAAI/AAAAAAAAAB4/1xfFVpg068w/photo.jpg?sz=50",
                    "isDefault" => false,
                ],
                "language" => "en",
                "verified" => false,
            ],
        ];
    */
    private function googleNormalizer($data)
    {
        return (object)[
            'token' => $data->token,
            'id'    => $data->id,
            'provider' => $data->provider,
            'identifier' => $data->id,
            'photoURL' => $data->avatar ?: null,
            'profileURL' => isset($data->user['url']) ? $data->user['url'] : null,
            'gender' => isset($data->user['gender']) ? $data->user['gender'] : null,
            'language' => isset($data->user['language']) ? $data->user['language'] : null,
            'email' => ($data->email) ?: null,
            'displayName' => $data->name,
        ];
    }
} 