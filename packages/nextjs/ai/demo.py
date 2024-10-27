import os
from dataclasses import dataclass
import torch
from peft import LoraConfig
from transformers import AutoModelForCausalLM, AutoTokenizer
from trl import SFTTrainer, SFTConfig
from dataset import SFTDataCollator, SFTDataset
from utils.constants import model2template

@dataclass
class LoraTrainingArguments:
    per_device_train_batch_size: int
    gradient_accumulation_steps: int
    num_train_epochs: int
    lora_rank: int
    lora_alpha: int
    lora_dropout: int

def train_lora(
    model_id: str, context_length: int, training_args: LoraTrainingArguments
):
    assert model_id in model2template, f"model_id {model_id} not supported"
    
    # Configure LoRA
    lora_config = LoraConfig(
        r=training_args.lora_rank,
        target_modules=["q_proj", "v_proj"],
        lora_alpha=training_args.lora_alpha,
        lora_dropout=training_args.lora_dropout,
        task_type="CAUSAL_LM",
        bias="none",
        inference_mode=False,
    )

    device = "mps" if torch.backends.mps.is_available() else "cpu"
    print(f"Using device: {device}")

    # Configure training
    training_args = SFTConfig(
        per_device_train_batch_size=training_args.per_device_train_batch_size,
        gradient_accumulation_steps=training_args.gradient_accumulation_steps,
        warmup_steps=100,
        learning_rate=2e-4,
        logging_steps=20,
        output_dir="outputs",
        optim="adamw_torch",
        remove_unused_columns=False,
        num_train_epochs=training_args.num_train_epochs,
        max_seq_length=context_length,
        logging_dir="logs",
        save_strategy="steps",
        save_steps=500,
    )
    
    tokenizer = AutoTokenizer.from_pretrained(
        model_id,
        use_fast=True,
        token=os.environ["HF_TOKEN"],
    )
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    model = AutoModelForCausalLM.from_pretrained(
        model_id,
        torch_dtype=torch.float32,
        token=os.environ["HF_TOKEN"],
    ).to(device)

    # Load dataset
    dataset = SFTDataset(
        file="demo_data.jsonl",
        tokenizer=tokenizer,
        max_seq_length=context_length,
        template={
            "system_format": "You are a smart contract security analyzer. Analyze the following contract for vulnerabilities and security issues.",
            "user_format": "Contract to analyze:\n{content}{stop_token}",
            "assistant_format": "Security Analysis:\n{content}{stop_token}"
        }
    )

    # Configure trainer
    trainer = SFTTrainer(
        model=model,
        train_dataset=dataset,
        args=training_args,
        peft_config=lora_config,
        data_collator=SFTDataCollator(tokenizer, max_seq_length=context_length),
    )

    print("Starting security analysis training...")
    trainer.train()
    
    print("Saving security-focused model...")
    trainer.save_model("outputs")
    
    print("Cleaning up checkpoints...")
    os.system("rm -rf outputs/checkpoint-*")

    print("Security analysis model training completed!")

if __name__ == "__main__":
    from utils.constants import model2template
    args = LoraTrainingArguments(
        per_device_train_batch_size=4,
        gradient_accumulation_steps=4,
        num_train_epochs=3,
        lora_rank=8,
        lora_alpha=32,
        lora_dropout=0.1
    )
    train_lora("Qwen/Qwen1.5-0.5B", 512, args)