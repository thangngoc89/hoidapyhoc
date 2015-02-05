<?php namespace Quiz\lib\Tagging;

use Quiz\lib\Tagging\TaggingUtil;
use Quiz\lib\Tagging\Tag;

/**
 * Copyright (C) 2014 Robert Conner
 */
trait TaggableTrait {

	/**
	 * Return collection of tags related to the tagged model
	 *
	 * @return Illuminate\Database\Eloquent\Collection
	 */
	public function tagged() {
		return $this->morphToMany('Quiz\lib\Tagging\Tag', 'taggable');
	}
	
	/**
	 * Perform the action of tagging the model with the given string
	 *
	 * @param $tagName string or array
	 */
	public function tag($tagNames) {
		$tagNames = TaggingUtil::makeTagArray($tagNames);
		
		foreach($tagNames as $tagName) {
			$this->addTag($tagName);
		}
	}
	
	/**
	 * Return array of the tag names related to the current model
	 *
	 * @return array
	 */
	public function tagNames() {
		$tagNames = array();
		$tagged = $this->tagged()->get(array('name'));

		foreach($tagged as $tag) {
			$tagNames[] = $tag->name;
		}
		
		return $tagNames;
	}

	/**
	 * Return array of the tag slugs related to the current model
	 *
	 * @return array
	 */
	public function tagSlugs() {
		$tagSlugs = array();
		$tagged = $this->tagged()->get(array('slug'));

		foreach($tagged as $tag) {
			$tagSlugs[] = $tag->slug;
		}
		
		return $tagSlugs;
	}

    public function tagList() {
        $tagged = $this->tagged()->get();
        return $tagged;
    }
	
	/**
	 * Remove the tag from this model
	 *
	 * @param $tagName string or array (or null to remove all tags)
	 */
	public function untag($tagNames=null) {
		if(is_null($tagNames)) {
			$currentTagNames = $this->tagNames();
			foreach($currentTagNames as $tagName) {
				$this->removeTag($tagName);
			}
			return;
		}
		
		$tagNames = TaggingUtil::makeTagArray($tagNames);
		
		foreach($tagNames as $tagName) {
			$this->removeTag($tagName);
		}
	}
	
	/**
	 * Replace the tags from this model
	 *
	 * @param $tagName string or array
	 */
	public function retag($tagNames) {
		$tagNames = TaggingUtil::makeTagArray($tagNames);
		$currentTagNames = $this->tagNames();

		$deletions = array_diff($currentTagNames, $tagNames);
		$additions = array_diff($tagNames, $currentTagNames);
		
		foreach($deletions as $tagName) {
			$this->removeTag($tagName);
		}
		foreach($additions as $tagName) {
			$this->addTag($tagName);
		}
	}
	
	/**
	 * Filter model to subset with the given tags
	 *
	 * @param $tagNames array|string
	 */
	public function scopeWithAllTags($query, $tagNames) {
		$tagNames = TaggingUtil::makeTagArray($tagNames);
		
		$normalizer = config('tagging.normalizer');
		$normalizer = empty($normalizer) ? '\Quiz\lib\Tagging\TaggingUtil::slug' : $normalizer;

        $tagNames = array_map($normalizer, $tagNames);

        foreach($tagNames as $tagSlug) {
			$query->whereHas('tagged', function($q) use($tagSlug) {
				$q->where('slug', $tagSlug);
			});
		}
		
		return $query;
	}
		
	/**
	 * Filter model to subset with the given tags
	 *
	 * @param $tagNames array|string
	 */
	public function scopeWithAnyTag($query, $tagNames) {
		$tagNames = TaggingUtil::makeTagArray($tagNames);

		$normalizer = config('tagging.normalizer');
		$normalizer = empty($normalizer) ? '\Quiz\lib\Tagging\TaggingUtil::slug' : $normalizer;
		
		$tagNames = array_map($normalizer, $tagNames);

		return $query->whereHas('tagged', function($q) use($tagNames) {
			$q->whereIn('slug', $tagNames);
		});
	}
	
	/**
	 * Adds a single tag
	 *
	 * @param $tagName string
	 */
	private function addTag($tagName) {
		$tagName = trim($tagName);

        if (strlen($tagName) < 1)
            return false;
		
		$normalizer = config('tagging.normalizer');
		$normalizer = empty($normalizer) ? '\Quiz\lib\Tagging\TaggingUtil::slug' : $normalizer;

		$tagSlug = call_user_func($normalizer, $tagName);

        $displayer = config('tagging.displayer');
        $displayer = empty($displayer) ? '\Str::title' : $displayer;

        $tag = Tag::where('slug',$tagSlug)->first();

        if (is_null($tag))
        {
            $tag = new Tag([
                'name'=>call_user_func($displayer, $tagName),
                'slug'=>$tagSlug,
            ]);
            $tag = $this->tagged()->save($tag);
        }

        // If item was tagged with this tag. Stop !!!
		$previousCount = $this->tagged()->where('tag_id', $tag->id)->take(1)->count();
		if($previousCount >= 1) { return; }

        // If item reach maximum tags per item. Stop !!!
        $previousTotal = $this->tagged()->get()->count();

        $maxTag = config('tagging.maxTag');
        $maxTag = (empty($maxTag)) ? 3 : $maxTag;
        if ($previousTotal >= $maxTag) { return; }

        $this->tagged()->attach($tag->id);
    }
	
	/**
	 * Removes a single tag
	 *
	 * @param $tagName string
	 */
	private function removeTag($tagName) {

		$tagName = trim($tagName);

        if (strlen($tagName) < 1)
            return false;
		$normalizer = config('tagging.normalizer');
		$normalizer = empty($normalizer) ? '\Quiz\lib\Tagging\TaggingUtil::slug' : $normalizer;
		
		$tagSlug = call_user_func($normalizer, $tagName);

        $tag = $this->tagged()->where('slug', '=', $tagSlug)->first();

        if (!is_null($tag))
        {
            $this->tagged()->detach($tag->id);
        }
	}
}
