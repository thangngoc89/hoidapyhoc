<?php
/**
 * Project : simple-php-git-deploy
 * User: thuytien
 * Date: 11/10/2014
 * Time: 12:39 AM
 */

namespace AutoGitPuller\Server\Github;

use AutoGitPuller\Server\BaseEvent;
use AutoGitPuller\Util\Error;

class Event extends BaseEvent{
   public function processRequest($secret = ''){
       $headers = getallheaders();
       $hubSignature = $headers['X-Hub-Signature'];
       $payload = file_get_contents('php://input');
       $data = json_decode($payload);
       if($secret!=='') {
           list($algo, $hash) = explode('=', $hubSignature, 2);
           var_dump($hubSignature);
           $payloadHash = hash_hmac($algo, $payload, $secret);
           if ($hash !== $payloadHash) {
               return new Error("","Secret key was not matched");
           }
       }
       return $data;
   }
}