<?php namespace Quiz\lib\API\Resources;

use League\Fractal\Resource\ResourceInterface;
use League\Fractal\Serializer\ArraySerializer;

class EmberSerializer extends ArraySerializer
{
    /**
     * Serialize a collection.
     *
     * @param string $resourceKey
     * @param array  $data
     *
     * @return array
     */
    public function collection($resourceKey, array $data)
    {
        return array($resourceKey ?: 'data' => $data);
    }

    /**
     * Serialize an item.
     *
     * @param string $resourceKey
     * @param array  $data
     *
     * @return array
     */
    public function item($resourceKey, array $data)
    {
        return array($resourceKey ?: 'data' => array($data));
    }

    /**
     * Serialize the included data.
     *
     * @param ResourceInterface $resource
     * @param array             $data
     *
     * @return array
     */
    public function includedData(ResourceInterface $resource, array $data)
    {
        $serializedData = array();
        $linkedIds = array();
        foreach ($data as $value) {
            foreach ($value as $includeKey => $includeValue) {
                foreach ($includeValue[$includeKey] as $itemValue) {
                    if (!array_key_exists('id', $itemValue)) {
                        $serializedData[$includeKey][] = $itemValue;
                        continue;
                    }

                    $itemId = $itemValue['id'];
                    if (!empty($linkedIds[$includeKey]) && in_array($itemId, $linkedIds[$includeKey], true)) {
                        continue;
                    }

                    $serializedData[$includeKey][] = $itemValue;
                    $linkedIds[$includeKey][] = $itemId;
                }
            }
        }

        return empty($serializedData) ? array() : $serializedData;
    }

    /**
     * Indicates if includes should be side-loaded.
     *
     * @return bool
     */
    public function sideloadIncludes()
    {
        return true;
    }
}