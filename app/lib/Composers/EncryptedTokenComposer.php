<?php namespace Quiz\lib\Composers;

use Illuminate\Contracts\View\View;

class EncryptedTokenComposer {

    public function compose(View $view)
    {
        $encrypter = app('Illuminate\Encryption\Encrypter');
//        $encrypted_token = $encrypter->encrypt(csrf_token());
        $encrypted_token = csrf_token();

        $view->with('encrypted_token', compact('encrypted_token'));
    }
} 