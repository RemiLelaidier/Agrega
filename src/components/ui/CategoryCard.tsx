import * as React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { ModalType } from 'src/App';

export interface CategoryCardProps {
    category: any;
    onClick?: (any);
}

class CategoryCard extends React.Component<CategoryCardProps> {

    render() {
        return(
            <Card className="card">
                <CardContent>
                    <Typography className="title" color="textSecondary">
                    Word of the Day
                    </Typography>
                </CardContent>
                <CardActions>
                    {this.renderButton()}
                </CardActions>
            </Card>
        );
    }

    private renderButton() {
        if(this.props.category) {
            return <Button size="small">Accéder à la categorie</Button>;
        } else {
            return <Button onClick={this.onClick()}>Nouvelle catégorie</Button>
        }
    }

    onClick = () => () => {
        this.props.onClick(ModalType.newCategory);
    }
}

export default CategoryCard;