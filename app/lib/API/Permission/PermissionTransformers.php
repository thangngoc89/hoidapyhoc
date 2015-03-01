<?php namespace Quiz\lib\API\Permission;

use League\Fractal\TransformerAbstract;
use Quiz\Models\Permission;

class PermissionTransformers extends TransformerAbstract {

    public function transform(Permission $perm)
    {
        return [
            'id'            => $perm->id,
            'name'          => $perm->name,
            'display_name'  => $perm->display_name,
        ];
    }
}