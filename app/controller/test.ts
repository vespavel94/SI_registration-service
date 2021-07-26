import { Validator, Validate } from 'typescript-class-validator';
import { IsDate, IsNotEmpty, MaxDate, IsEmail, Length } from 'class-validator';
 
class DataDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  
  @Length(10, 200)
  @IsNotEmpty()
  description: string;
  
  @IsDate()
  @IsNotEmpty()
  @MaxDate(new Date())
  birthDate: Date;
}
 
class TestClass {
  @Validate()
  methodName(@Validator() data: DataDto) {
    
  }
 
  @Validate()
  serverControllerEndpoint(@Validator(DataDto, 'body') req: Request) {
    
  }
}
 
const instance = new TestClass();
 
// Will throw class-validator errors on runtime
instance.methodName({
  birthDate: new Date(),
  description: '123',
  email: 'fakemail'
});
 
instance.serverControllerEndpoint({
  body: {
    birthDate: new Date(),
    description: '123',
    email: 'fakemail'
  }
});