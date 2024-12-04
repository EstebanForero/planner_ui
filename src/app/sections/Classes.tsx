"use client";
import { add_user, ClassU, get_classes } from '@/lib/planner_backend';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react'
import { Element } from 'react-scroll'
import {Spinner} from "@nextui-org/spinner";
import {Button, ButtonGroup} from "@nextui-org/button";
import {  Modal,   ModalContent,   ModalHeader,   ModalBody,   ModalFooter, useDisclosure} from "@nextui-org/modal";


const Classes = () => {

  const [userId, setUserId] = useState('')
  const [userIdTextField, setUserIdTextField] = useState('')
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const { data, isError, isLoading } = useQuery({
    queryKey: ['classes', userId],
    queryFn: async () => await get_classes(Number(userId))
  })

  return (
    <section className='mt-2'>
      <input type='number' onChange={(e) => setUserIdTextField(e.target.value)} className='rounded-lg px-4 py-1 m-4' placeholder='user id' value={userIdTextField}/>
      <button className='text-white rounded-lg bg-black border border-purple-500 p-2'
        onClick={async () => {
          const user_id = await add_user()
          setUserId(String(user_id))
          setUserIdTextField(String(user_id))
        }}
      >Register</button>
      <button className='text-white rounded-lg bg-black border border-purple-500 p-2 ml-4'
        onClick={async () => {
          setUserId(userIdTextField)
        }}
      >Log In</button>
      <button className='text-white rounded-lg bg-black border border-purple-500 p-2 ml-4'
        onClick={onOpen}
      >Add class</button>
      <ClassAdderModal onOpenChange={onOpenChange} isOpen={isOpen}/>
      <Element name='classes'>
        {isError ?
          <p className='text-red-500'>Invalid user id</p>
        : 
          <div>
            {data?.map(class_info => <Class key={class_info.class_id} class_id={class_info.class_id}/>)}
          </div>
        }
      </Element>
    </section>
  )
}

export default Classes


type ClassProps = {
  class_id: number
}

const Class = ({ class_id }: ClassProps) => {
  return (
    <div className='bg-black border border-purple-600 rounded-lg min-h-20 max-w-[520px]'>Classes</div>
  )
}

type ClassAdderProps = {
  isOpen: boolean
  onOpenChange: () => void
}

const ClassAdderModal = ({ isOpen, onOpenChange }: ClassAdderProps) => {
  return <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
          <ModalBody>
            <p> 
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Nullam pulvinar risus non risus hendrerit venenatis.
              Pellentesque sit amet hendrerit risus, sed porttitor quam.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Nullam pulvinar risus non risus hendrerit venenatis.
              Pellentesque sit amet hendrerit risus, sed porttitor quam.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            <Button color="primary" onPress={onClose}>
              Action
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  </Modal>
}
