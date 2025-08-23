'use client'

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {SmileIcon} from "lucide-react";
import Picker from '@emoji-mart/react';
import data from "@emoji-mart/data"
import {useChatActions} from "@/context/ChatActionsContext";

interface EmojiPickerProps {
    onChange: (value: string) => void;
}

export const EmojiPicker = () => {
    const {onEmojiSelect} = useChatActions();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button type="button">
                    <SmileIcon className="h-5 w-5 text-muted-foreground hover:text-foreground transition"/>
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-full">
                <Picker
                    emojiSize={18}
                    theme="light"
                    data={data}
                    maxFrequentRows={1}
                    onEmojiSelect={(emoji: any) => onEmojiSelect?.(emoji.native)}
                />
            </PopoverContent>
        </Popover>
    );
};
