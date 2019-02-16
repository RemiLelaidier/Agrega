import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Create a observable from a input that emit null
 * until the validation function return true
 *
 * @export
 * @param {Element} element
 * @param {string} eventType
 * @param {(value: any) => boolean} validation
 * @returns {Observable<string>}
 */
export function observeSubject(subject: BehaviorSubject<string>, validation: (value: any) => boolean): Observable<string | null> {
    return subject.pipe(
        map((value:string) => {
            if(!validation(value)) {
                return null;
            }
            return value;
        })
    )
}