<?php
/**
 * Created by PhpStorm.
 * User: marcosgrimm
 * Date: 21/11/15
 * Time: 20:26
 */

namespace CodeProject\Services;


use CodeProject\Repositories\ProjectNoteRepository;
use CodeProject\Validators\ProjectNoteValidator;
use Prettus\Validator\Exceptions\ValidatorException;

class ProjectMemberService
{

    /**
     * @var ProjectMemberRepository
     */
    protected $repository;
    /**
     * @var ProjectMemberValidator
     */
    private $validator;

    public function __construct(ProjectMemberRepository $repository, ProjectMemberValidator $validator)
    {

        $this->repository = $repository;
        $this->validator = $validator;
    }

    public function create(array $data){
        try
        {
            $this->validator->with($data)->passesOrFail();
            return $this->repository->create($data);
        }catch (ValidatorException $e){
            return [
                'error'=>true,
                'message'=>$e->getMessageBag()
            ];
        }
    }

    public function update(array $data,$id){
        try
        {
            $this->validator->with($data)->passesOrFail();
            return $this->repository->update($data,$id);
        }catch (ValidatorException $e){
            return [
                'error'=>true,
                'message'=>$e->getMessageBag()
            ];
        }

    }


}