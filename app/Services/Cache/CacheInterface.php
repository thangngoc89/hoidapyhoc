<?php
namespace Quiz\Services\Cache;


interface CacheInterface {

    /**
     * Get
     *
     * @param string $key
     * @return mixed
     */
    public function get($key);

    /**
     * Put
     *
     * @param string $key
     * @param mixed $value
     * @param integer $minutes
     * @return mixed
     */
    public function put($key, $value, $minutes = null);

    /**
     * Has
     *
     * @param string $key
     * @return bool
     */
    public function has($key);

    /**
     * Put a value to cache forever
     *
     * @param $key
     * @param $value
     * @return mixed
     */
    public function forever($key, $value);

} 