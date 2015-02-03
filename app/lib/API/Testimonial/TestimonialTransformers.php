<?php namespace Quiz\lib\API\Testimonial;

use League\Fractal\TransformerAbstract;
use Quiz\Models\Testimonial;

class TestimonialTransformers extends TransformerAbstract {

    public function transform(Testimonial $testimonial)
    {
        return [
            'id'            => (int) $testimonial->id,
            'name'          => $testimonial->name,
            'avatar'        => $testimonial->avatar,
            'content'       => $testimonial->content,
            'isHome'        => (boolean) $testimonial->isHome,
        ];
    }
}
