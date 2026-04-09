<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gender extends Model
{
    use HasFactory, Notifiable;

    protected $stable = 'tbl_genders';
    protected $primaryKey ='gender_id';
    protected $fillable = [
        'gender',
        'is_deleted',
    ];
}
