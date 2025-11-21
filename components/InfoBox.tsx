import React from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from 'lucide-react';
import Image from 'next/image';

interface InfoBoxProps{
    type:string;
}

const InfoBox = ({type}:InfoBoxProps) => {
    return (
        <Dialog>
            <DialogTrigger className='bg-white hover:cursor-pointer hover:bg-gray-200 p-2 rounded-xl'>
                <Info color={"#0000ff"} size={16}/>
            </DialogTrigger>
            <DialogContent className='z-200'>
                {type === "odometer" ?
                    <>
                        <DialogHeader>
                            <DialogTitle>Take a picture of your dashboard</DialogTitle>
                            <DialogDescription>
                                Our AI will extract the odometer from the picture
                            </DialogDescription>
                        </DialogHeader>
                        <div className='flex flex-col items-center'>
                            <Image
                                src="/odometer.png"
                                alt="odometer image instructions"
                                width={200}
                                height={200}
                            />
                            <ol className='list-decimal text-sm text-gray-800'>
                                <li>Position your phone directly in front of the dashboard so the odometer is centered in the frame.</li>
                                <li>Make sure the entire odometer display is visible — avoid capturing only part of the screen.</li>
                                <li>Remove any obstructions, such as your hand, the steering wheel, shadows, or reflections.</li>
                                <li>Hold your phone steady and allow the camera to focus before taking the picture.</li>
                                <li>Ensure good lighting — avoid glare from sunlight or dark, low-light conditions.</li>
                            </ol>
                        </div>
                    </> : <>
                        <DialogHeader>
                            <DialogTitle>Take a picture of your receipt</DialogTitle>
                            <DialogDescription>
                                Our AI will extract the data from your receipt
                            </DialogDescription>
                        </DialogHeader>
                        <div className='flex flex-col items-center'>
                            <Image
                                src="/receipt.png"
                                alt="receipt image instructions"
                                width={200}
                                height={200}
                            />
                            <ol className='list-decimal text-sm text-gray-800'>
                                <li>Place the receipt on a flat, well-lit surface.</li>
                                <li>Fill the frame with the receipt — avoid cropping out any part of the receipt.</li>
                                <li>Remove any obstructions, such as your hand, the edge of the table, shadows, or reflections.</li>
                                <li>Hold your phone steady and allow the camera to focus before taking the picture.</li>
                                <li>Ensure good lighting — avoid glare from sunlight or dark, low-light conditions.</li>
                                <li>Do not zoom in; move the phone closer or farther until the entire receipt is clear.</li>
                            </ol>
                        </div>
                    </>}
            </DialogContent>
        </Dialog>
    )
}

export default InfoBox