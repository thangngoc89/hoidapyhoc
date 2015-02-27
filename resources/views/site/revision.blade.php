<table>
@foreach($revisions as $revision)
    <tr>
        <td class="revision-timestamp">{!! $revision->created_at !!}</td>
        <td class="revision-type">{!! $revision->type !!}</td>
        <td class="revision-table_name">{!! $revision->table_name !!}</td>
        <td class="revision-row_id">{!! $revision->row_id !!}</td>
        <td class="revision-diff"> {!! $revision->renderDiff() !!} </td>
        <td class="revision-user">{!! $revision->user_name !!}</td>
    </tr>
@endforeach
</table>