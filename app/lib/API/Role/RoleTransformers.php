<?php namespace Quiz\lib\API\Role;

use League\Fractal\TransformerAbstract;
use Quiz\Models\Role;

class RoleTransformers extends TransformerAbstract {

    public function transform(Role $role)
    {
        return [
            'id'            => $role->id,
            'name'          => $role->name,
            'count'         => $role->users()->count(),
            'created_at'    => $role->created_at,
            'permissions'   => $role->perms()->get()->modelKeys(),
        ];
    }
}
