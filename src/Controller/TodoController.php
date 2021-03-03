<?php

namespace App\Controller;

use App\Entity\Todo;
use App\Form\TodoType;
use App\Repository\TodoRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * @Route("/todo")
 */
class TodoController extends AbstractController
{

    private $todoRepository;

    public function __construct(TodoRepository $todoRepository)
    {
        $this->todoRepository = $todoRepository;
    }



    /**
     * @Route("/", name="todo_index", methods={"GET"})
     */
    public function index(): Response
    {
        $data = $this->todoRepository->findAll();
        return $this->json($data);
    }

    /**
     * @Route("/new", name="todo_new", methods={"GET","POST"})
     */
    public function new(Request $request, SerializerInterface $serializerInterface, EntityManagerInterface $entityManager, ValidatorInterface $validatorInterface): Response
    {
        try {
            $data = $request->getContent();
            $todo = $serializerInterface->deserialize($data,Todo::class,"json");
            $errors = $validatorInterface->validate($todo);
            if(count($errors)>0){
                return $this->json(["status"=> 400, "message"=>"content shold not be blank."]);
            }
            $entityManager->persist($todo);
            $entityManager->flush();
            $this->json(["status"=>201, "message"=>"sucess"],201);
        } catch (\Throwable $th) {
            return $this->json(["status"=> 400, "message"=>"Not encodable value exception."]);
        }
    }

    /**
     * @Route("/{id}", name="todo_show", methods={"GET"})
     */
    public function show(int $id): Response
    {
        try {
            $data = $this->todoRepository->find($id);
            return $this->json($data);
        } catch (\Throwable $th) {
            return $this->json(["status"=>404, "message"=>"not found 404"],404);
        }
    }

    // /**
    //  * @Route("/{id}/edit", name="todo_edit", methods={"GET","POST"})
    //  */
    // public function edit(Request $request, Todo $todo): Response
    // {
    //     // $form = $this->createForm(TodoType::class, $todo);
    //     // $form->handleRequest($request);

    //     // if ($form->isSubmitted() && $form->isValid()) {
    //     //     $this->getDoctrine()->getManager()->flush();

    //     //     return $this->redirectToRoute('todo_index');
    //     // }

    //     // return $this->render('todo/edit.html.twig', [
    //     //     'todo' => $todo,
    //     //     'form' => $form->createView(),
    //     // ]);
    // }

    // /**
    //  * @Route("/{id}", name="todo_delete", methods={"DELETE"})
    //  */
    // public function delete(Request $request, Todo $todo): Response
    // {
    //     // if ($this->isCsrfTokenValid('delete'.$todo->getId(), $request->request->get('_token'))) {
    //     //     $entityManager = $this->getDoctrine()->getManager();
    //     //     $entityManager->remove($todo);
    //     //     $entityManager->flush();
    //     // }

    //     // return $this->redirectToRoute('todo_index');
    // }
}
