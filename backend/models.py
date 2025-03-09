from typing import Optional, List, Union # Supports for type hints
from pydantic import BaseModel # Most widely used data validation library for python
from enum import Enum # Supports for enumerations

class User(BaseModel):
    username: str
    email_address: str
    password: str
#{category:"",budget:"",month:"",email_address:""}
class Record(BaseModel):
    recordType: str
    category: str
    note: str
    email_address: str
    amount: str
    time: str
    date: str

class RecordWithPassword(Record):
    password: str

class Budget(BaseModel):
    category: str
    budget: str
    month: str
    email_address: str

class BudgetWithPassword(Budget):
    category: str
    budget: str
    month: str
    email_address: str
    password: str