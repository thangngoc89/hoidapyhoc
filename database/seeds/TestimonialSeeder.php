<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TestimonialSeeder extends Seeder {

    public function run()
    {
        DB::table('testimonials')->delete();

        $data = array(
            array(
                'name'      => 'Bác Sĩ Nhà Quê',
                'link'      => 'http://chiaseykhoa.com',
                'avatar'   => 'https://fbcdn-sphotos-c-a.akamaihd.net/hphotos-ak-xpa1/v/t1.0-9/10850097_342115832657818_6572643306571068067_n.jpg?oh=6777ab4e145fc1bcdeb815fa15b1ad12&oe=5536D0C6&__gda__=1428626814_00489d31b31dc4ce93a0f61aeb28903f',
                'content'   => 'Quiz là một mô hình quá tốt để chia sẽ đề thi',
                'isHome'    => 1
            ),
            array(
                'name'      => 'Thiên Thanh',
                'link'      => '',
                'avatar'   => 'http://ask.hoidapyhoc.com/user_avatar/ask.hoidapyhoc.com/thanh19/120/15.png',
                'content'   => 'Quiz đã giúp tôi ôn tập hiệu quả và dễ dàng vượt qua các kì thi',
                'isHome'    => 1
            ),
            array(
                'name'      => 'Phò Cái Lò',
                'link'      => 'https://www.facebook.com/groups/thithugiaiphau/?fref=ts',
                'avatar'   => 'https://fbcdn-sphotos-c-a.akamaihd.net/hphotos-ak-xpa1/v/t1.0-9/10481847_1459999527572425_4248171707208788371_n.jpg?oh=b39e1602df3e0facd8f14f57a9a062c6&oe=552F9BDD&__gda__=1430245815_a7caace38b1d71e187e3a415a92b1f8f',
                'content'   => 'Nhờ có Quiz. Tôi không còn chấm bài thi thử bằng tay nữa',
                'isHome'    => 1
            ),
            array(
                'name'      => 'Nguyễn Đông Hải',
                'link'      => 'https://www.facebook.com/donghaipro',
                'avatar'   => 'https://fbcdn-sphotos-f-a.akamaihd.net/hphotos-ak-xfp1/v/t1.0-9/10701970_705441539554218_5243374930990581238_n.jpg?oh=24b62e5172fdea440ab1062c8182e710&oe=55343915&__gda__=1429003420_d1e12f03e2af978d6b2f455bd649ddc5',
                'content'   => 'Hỏi Đáp Y Học giúp tôi có thể tổ chức tài liệu của nhóm mình một các hiệu quả.',
                'isHome'    => 1
            ),
        );

        DB::table('testimonials')->insert( $data );
    }

}
