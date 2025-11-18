import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Input } from '../ui/input';
import TweetCard from './TweetCard';
import type { ITweet } from '@/types/auth';
import useAuth from '@/hooks/useAuth';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

// interface Props {
//     open?: boolean;
//     setOpen?: (v: boolean) => void;
//     tweet: ITweet;
// }

// const TweetRepost = ({ open, setOpen, tweet }: Props) => {

//     const [content, setContent] = useState<string>('')
//     const { user } = useAuth()

//     return (
//         <Dialog open={open} onOpenChange={setOpen} >
//             <DialogContent className='lg:max-w-xl overflow-hidden'>
//                 <DialogHeader>
//                     <DialogTitle>Repost</DialogTitle>
//                 </DialogHeader>
//                 <div className="flex items-center space-x-4 overflow-hidden w-full">
//                     <img className="rounded-full w-10 h-10" draggable="false" src={user?.profilePicture} alt="profile Pic" />
//                     <div className="flex flex-col space-y-2 relative w-full">
//                         <Textarea
//                             className="h-32 w-full max-h-32 resize-none overflow-y-auto"
//                             maxLength={500}
//                             placeholder="Share something with the community..."
//                             value={content}
//                             onChange={e => setContent(e.target.value)}
//                         />
//                         <p className="font-semibold absolute right-2 bottom-2 text-xs text-red-600">{500 - content.length}/500</p>
//                     </div>
//                 </div>
//                     <DialogFooter>
//                         <Button variant='default'>Repost</Button>   
//                     </DialogFooter>
//             </DialogContent>
//                 <TweetCard cn='w-8/10 mx-auto' tweet={tweet} />
//         </Dialog >
//     )
// }

// export default TweetRepost


const TweetRepost = ({ open, setOpen, tweet }: Props) => {
    const [content, setContent] = useState<string>('');
    const { user } = useAuth();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="lg:max-w-xl overflow-hidden">
                <DialogHeader>
                    <DialogTitle>Repost</DialogTitle>
                </DialogHeader>

                <div className="flex items-center space-x-4 w-full">
                    <img className="rounded-full w-10 h-10" draggable="false" src={user?.profilePicture} />
                    <div className="flex flex-col space-y-2 relative w-full">
                        <Textarea
                            className="h-32 resize-none overflow-y-auto"
                            maxLength={500}
                            placeholder="Share something with the community..."
                            value={content}
                            onChange={e => setContent(e.target.value)}
                        />
                        <p className="font-semibold absolute right-2 bottom-2 text-xs text-red-600">
                            {500 - content.length}/500
                        </p>
                    </div>
                </div>

                {/* Tweet Preview (simple, NOT TweetCard) */}
                <div className="mt-4 border p-3 rounded-lg bg-muted/30 text-sm">
                    <p className="font-semibold">@{tweet.author.userName}</p>
                    <p>{tweet.title}</p>
                </div>

                <DialogFooter>
                    <Button variant="default">Repost</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
