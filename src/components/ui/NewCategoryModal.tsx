import * as React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';

interface NewCategoryModalProps {
    onClose: (any);
}

class NewCategoryModal extends React.Component<NewCategoryModalProps> {
    render() {
        return (
            <Dialog 
                onClose={this.handleClose()} 
                aria-labelledby="simple-dialog-title"
                open={true}
            >
                <DialogTitle id="simple-dialog-title">Nouvelle catégorie</DialogTitle>
                    <div>
                        Salut
                    </div>
            </Dialog>
        );
    }

    handleClose = () => () => {
        this.props.onClose();
    }
}

export default NewCategoryModal;