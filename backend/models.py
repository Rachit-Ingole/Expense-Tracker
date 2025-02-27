from typing import Optional, List, Union # Supports for type hints
from pydantic import BaseModel # Most widely used data validation library for python
from enum import Enum # Supports for enumerations


class User(BaseModel):
    username: str
    email_address: str
    password: str

class Record(BaseModel):
    recordType: str
    category: str
    note: str
    email_address: str
    amount: str
    time: str
    date: str

