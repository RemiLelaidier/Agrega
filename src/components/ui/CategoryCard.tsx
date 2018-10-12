import * as React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
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
            this.renderCard()
        );
    }

    private renderButton() {
        if(this.props.category) {
            return <Button size="small">Accéder à la categorie</Button>;
        } else {
            return <Button onClick={this.onClick()}>Nouvelle catégorie</Button>
        }
    }

    private renderContent() {
        if(this.props.category) {
            return (
                <div>
                    <h3>{this.props.category.name}</h3>
                    <h4>{this.props.category.description}</h4>
                    <p>{this.props.category.ressources.length} articles</p>
                </div>
            );
        }
        return;
    }

    private renderCard() {
        if(this.props.category) {
            const color: React.CSSProperties = {
                backgroundColor: this.props.category.color
            }
            return (
                <Card className="card" style={color}>
                    <CardContent>
                        {this.renderContent()}
                    </CardContent>
                    <CardActions>
                        {this.renderButton()}
                    </CardActions>
                </Card>
            );
        } else {
            return (
                <Card className="card">
                <CardContent>
                    {this.renderContent()}
                </CardContent>
                <CardActions>
                    {this.renderButton()}
                </CardActions>
            </Card>
            );
        }
    }

    onClick = () => () => {
        this.props.onClick(ModalType.newCategory);
    }
}

export default CategoryCard;