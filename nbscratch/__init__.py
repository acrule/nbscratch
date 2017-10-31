"""
NBScratch: Jupyter Notebook Extension placing a computational scratchpad in the
notebook
"""

import os
import json
import datetime

from notebook.utils import url_path_join
from notebook.base.handlers import IPythonHandler, path_regex

class NBScratchHandler(IPythonHandler):

    # manage connections to various sqlite databases
    db_manager_directory = {}

    # check if extension loaded by visiting http://localhost:8888/api/nbscratch
    def get(self, path=''):
        """
        Handle GET request
        """

        html = "<h1>NBScratch is working</h1>"
        self.write(html)

    def post(self, path=''):
        """
        Handle POST request
        """

        print("Just got the NBScratch POST requst")
        self.finish(json.dumps({'time': datetime.now()}))

def _jupyter_server_extension_paths():
    """
    Jupyter server configuration
    returns dictionary with where to find server extension files
    """
    return [{
        "module": "nbscratch"
    }]

def _jupyter_nbextension_paths():
    """
    Jupyter nbextension configuration
    returns dictionary with where to find nbextension files
    """
    return [dict(
        section="notebook",
        # the path is relative to the `nbscratch` directory
        src="static",
        # directory in the `nbscratch/` namespace
        dest="nbscratch",
        # _also_ in the `nbscratch/` namespace
        require="nbscratch/main")]

def load_jupyter_server_extension(nb_app):
    """
    Load the server extension and set up routing to proper handler
    nb_app: (obj) Jupyter Notebook Application
    """

    nb_app.log.info('NBScratch Server extension loaded')
    web_app = nb_app.web_app
    host_pattern = '.*$'
    route_pattern = url_path_join(web_app.settings['base_url'],
                                    r"/api/nbscratch%s" % path_regex)
    web_app.add_handlers(host_pattern, [(route_pattern, NBScratchHandler)])
