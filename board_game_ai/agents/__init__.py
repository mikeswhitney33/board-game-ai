from .base_agent import BaseAgent
from .human_agent import HumanAgent
from .minimax_agent import MinimaxAgent
from .montecarlo_agent import MCAgent
from .random_agent import RandomAgent

AGENT_MAP = {
    "human": HumanAgent,
    "minimax": MinimaxAgent,
    "random": RandomAgent,
    "mc": MCAgent,
    "montecarlo": MCAgent,
}

AGENT_LIST = list(AGENT_MAP.keys())
