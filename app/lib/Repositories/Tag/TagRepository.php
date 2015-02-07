<?php namespace Quiz\lib\Repositories\Tag;

use Quiz\lib\Repositories\BaseRepository;

interface TagRepository extends BaseRepository {

    public function allTagsWithCount();

    public function examSelectedTags($examId);

    public function examTagNames($examId);

    public function searchByName($query);

}